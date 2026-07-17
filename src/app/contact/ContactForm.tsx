"use client";

import React, { useState, useRef, FormEvent } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import validateEmail from "@/lib/validateEmail";

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
    const [error, setError] = useState<FormError>({ email: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string>("");
    const [turnstileError, setTurnstileError] = useState(false);

    const visitorFirstName = useRef<HTMLInputElement>(null);
    const visitorLastName = useRef<HTMLInputElement>(null);
    const visitorEmail = useRef<HTMLInputElement>(null);
    const visitorSubject = useRef<HTMLInputElement>(null);
    const visitorMessage = useRef<HTMLTextAreaElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.classList.remove("border-red-500");
        setError({ email: "" });
    };

    const handleContactFormSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const emailValue = visitorEmail.current?.value || "";

        if (!validateEmail(emailValue)) {
            visitorEmail.current?.classList.add("border-red-500");
            setError({ email: "This email is not valid. Kindly check again." });
            return;
        }

        if (!isTurnstileConfigured) {
            setShowAlert(true);
            setServerError(true);
            return;
        }

        if (!turnstileToken) {
            setTurnstileError(true);
            return;
        }

        setIsSubmitting(true);
        setServerError(false);
        setTurnstileError(false);

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
        } catch (err) {
            console.error("Error sending message:", err);
            setShowAlert(true);
            setServerError(true);
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                setShowAlert(false);
            }, 20000);
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
                    className="row-list"
                    style={{ marginBottom: "1.5rem", padding: "0.85rem 0" }}
                    role="status"
                >
                    <strong className="row-title">Message sent.</strong>
                    <p className="row-desc">I will get back to you soon.</p>
                </div>
            )}

            {showAlert && serverError && (
                <div style={{ marginBottom: "1.5rem" }} role="alert">
                    <strong className="row-title">Something went wrong.</strong>
                    <p className="row-desc">
                        Try again or email{" "}
                        <a href="mailto:hello@panchamkhaitan.com">
                            hello@panchamkhaitan.com
                        </a>
                        .
                    </p>
                </div>
            )}

            <form
                onSubmit={handleContactFormSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gap: "1.25rem",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(12rem, 1fr))",
                    }}
                >
                    <div>
                        <label htmlFor="firstName">First name</label>
                        <input
                            id="firstName"
                            type="text"
                            ref={visitorFirstName}
                            name="first-name"
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
                        required
                        onChange={handleInputChange}
                    />
                    {error.email && (
                        <p className="row-desc" style={{ color: "inherit" }}>
                            {error.email}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="subject">Subject</label>
                    <input
                        id="subject"
                        type="text"
                        ref={visitorSubject}
                        name="subject"
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
                            <a href="mailto:hello@panchamkhaitan.com">
                                hello@panchamkhaitan.com
                            </a>{" "}
                            instead.
                        </p>
                    )}
                    {turnstileError && (
                        <p className="row-desc">
                            Complete the verification to continue.
                        </p>
                    )}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting || !isTurnstileConfigured}
                    >
                        {isSubmitting ? "Sending…" : "Send message"}
                    </button>
                </div>
            </form>

            {!compact && (
                <p className="row-extra muted" style={{ marginTop: "1.5rem" }}>
                    Or write directly to{" "}
                    <a href="mailto:hello@panchamkhaitan.com">
                        hello@panchamkhaitan.com
                    </a>
                </p>
            )}
        </div>
    );
}
