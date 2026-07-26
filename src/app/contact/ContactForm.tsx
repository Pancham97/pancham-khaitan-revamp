"use client";

import React, { useState, useRef, FormEvent } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import validateEmail from "@/lib/validateEmail";
import { SITE } from "@/data/site";

interface FormError {
    email: string;
}

const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
const isTurnstileConfigured = Boolean(turnstileSiteKey);

type ContactFormProps = {
    /** Hide the page title block when embedded under /contact chrome */
    compact?: boolean;
};

export default function ContactForm({ compact = false }: ContactFormProps) {
    const [showAlert, setShowAlert] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState<FormError>({ email: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string>("");
    const [turnstileError, setTurnstileError] = useState(false);

    const visitorFirstName = useRef<HTMLInputElement>(null);
    const visitorLastName = useRef<HTMLInputElement>(null);
    const visitorEmail = useRef<HTMLInputElement>(null);
    const visitorSubject = useRef<HTMLInputElement>(null);
    const visitorMessage = useRef<HTMLTextAreaElement>(null);
    const successRef = useRef<HTMLDivElement>(null);
    const alertRef = useRef<HTMLDivElement>(null);

    const handleEmailChange = () => {
        if (error.email) {
            setError({ email: "" });
        }
    };

    const handleContactFormSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const emailValue = visitorEmail.current?.value || "";

        if (!validateEmail(emailValue)) {
            setError({ email: "Enter a valid email address." });
            visitorEmail.current?.focus();
            return;
        }

        if (!isTurnstileConfigured) {
            setShowAlert(true);
            setServerError(true);
            setErrorMessage(
                `Verification is not available. Email ${SITE.email} instead.`,
            );
            return;
        }

        if (!turnstileToken) {
            setTurnstileError(true);
            return;
        }

        setIsSubmitting(true);
        setServerError(false);
        setErrorMessage("");
        setTurnstileError(false);
        setShowAlert(false);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: visitorFirstName.current?.value || "",
                    lastName: visitorLastName.current?.value || "",
                    email: emailValue,
                    subject: visitorSubject.current?.value || "",
                    message: visitorMessage.current?.value || "",
                    turnstileToken,
                }),
            });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error("rate_limited");
                }
                throw new Error("Failed to send message");
            }

            setShowAlert(true);
            setServerError(false);
            setTurnstileToken("");

            if (visitorFirstName.current) {
                visitorFirstName.current.value = "";
            }
            if (visitorLastName.current) {
                visitorLastName.current.value = "";
            }
            if (visitorEmail.current) {
                visitorEmail.current.value = "";
            }
            if (visitorSubject.current) {
                visitorSubject.current.value = "";
            }
            if (visitorMessage.current) {
                visitorMessage.current.value = "";
            }

            window.requestAnimationFrame(() => {
                successRef.current?.focus();
            });
        } catch (err) {
            console.error("Error sending message:", err);
            setShowAlert(true);
            setServerError(true);
            const isRateLimited =
                err instanceof Error && err.message === "rate_limited";
            setErrorMessage(
                isRateLimited
                    ? `Too many messages. Wait a bit, or email ${SITE.email} directly.`
                    : `Try again in a bit, or email ${SITE.email} directly.`,
            );
            window.requestAnimationFrame(() => {
                alertRef.current?.focus();
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {!compact && (
                <header className="page-header">
                    <h1 className="page-title">Contact</h1>
                    <p className="page-lede">
                        Work, singing, or a simple hello. I read everything and
                        reply.
                    </p>
                </header>
            )}

            {showAlert && !serverError && (
                <div
                    ref={successRef}
                    className="form-banner form-banner--ok"
                    role="status"
                    tabIndex={-1}
                >
                    <strong className="row-title">Message sent.</strong>
                    <p className="row-desc">I will get back to you soon.</p>
                </div>
            )}

            {showAlert && serverError && (
                <div
                    ref={alertRef}
                    className="form-banner form-banner--error"
                    role="alert"
                    tabIndex={-1}
                >
                    <strong className="row-title">Something went wrong.</strong>
                    <p className="row-desc">
                        {errorMessage || (
                            <>
                                Try again in a bit, or email{" "}
                                <a href={`mailto:${SITE.email}`}>
                                    {SITE.email}
                                </a>{" "}
                                directly.
                            </>
                        )}
                    </p>
                </div>
            )}

            <form
                onSubmit={handleContactFormSubmit}
                className="contact-form"
                noValidate
            >
                <div className="contact-form__row">
                    <div>
                        <label htmlFor="firstName">First name</label>
                        <input
                            id="firstName"
                            type="text"
                            ref={visitorFirstName}
                            name="first-name"
                            autoComplete="given-name"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName">Last name</label>
                        <input
                            id="lastName"
                            type="text"
                            ref={visitorLastName}
                            name="last-name"
                            autoComplete="family-name"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        ref={visitorEmail}
                        name="email"
                        autoComplete="email"
                        inputMode="email"
                        required
                        aria-invalid={error.email ? true : undefined}
                        aria-describedby={
                            error.email ? "email-error" : undefined
                        }
                        onChange={handleEmailChange}
                        className={error.email ? "is-invalid" : undefined}
                    />
                    {error.email ? (
                        <p id="email-error" className="form-field-error" role="alert">
                            {error.email}
                        </p>
                    ) : null}
                </div>

                <div>
                    <label htmlFor="subject">Subject</label>
                    <input
                        id="subject"
                        type="text"
                        ref={visitorSubject}
                        name="subject"
                        autoComplete="off"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        ref={visitorMessage}
                        name="message"
                        required
                        rows={6}
                    />
                </div>

                <div>
                    {isTurnstileConfigured ? (
                        <Turnstile
                            siteKey={turnstileSiteKey}
                            onSuccess={(token) => {
                                setTurnstileToken(token);
                                setTurnstileError(false);
                            }}
                            onError={() => {
                                setTurnstileToken("");
                                setTurnstileError(true);
                            }}
                            onExpire={() => {
                                setTurnstileToken("");
                                setTurnstileError(true);
                            }}
                        />
                    ) : (
                        <p className="row-desc">
                            Verification is not available. Email{" "}
                            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>{" "}
                            instead.
                        </p>
                    )}
                    {turnstileError ? (
                        <p className="form-field-error" role="alert">
                            Complete the verification to continue.
                        </p>
                    ) : null}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting || !isTurnstileConfigured}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? "Sending…" : "Send message"}
                    </button>
                </div>
            </form>

            {!compact && (
                <p className="row-extra muted" style={{ marginTop: "1.5rem" }}>
                    Or write directly to{" "}
                    <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </p>
            )}
        </div>
    );
}
