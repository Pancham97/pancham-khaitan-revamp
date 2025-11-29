"use client";

import React, { useState, useRef, FormEvent } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import validateEmail from "@/lib/validateEmail";

interface FormError {
    email: string;
}

export default function ContactForm() {
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
            <div className="mx-auto max-w-3xl py-6 space-y-10">
                <header className="space-y-4">
                    <h1 className="big-headline-text">Contact</h1>
                    <p
                        className={`
                          text-neutral-700
                          dark:text-neutral-300
                          text-lg leading-relaxed
                        `}
                    >
                        Feel like sharing your thoughts with me, or hiring me as
                        a software engineer? Maybe want me to sing at your
                        nephew&apos;s birthday party? I am not a professional
                        party singer, but I would love to do it some time. Even
                        if it&apos;s just to say hi, I would love to hear from
                        you. Simply write your message and send it to me. I
                        promise I will respond.
                    </p>
                </header>

                {showAlert && !serverError && (
                    <div
                        className={`
                          bg-neutral-100
                          dark:bg-neutral-900/30
                          border border-neutral-300
                          dark:border-neutral-600
                          text-neutral-800
                          dark:text-neutral-200
                          px-4 py-3 rounded-lg relative
                        `}
                        role="alert"
                    >
                        <button
                            onClick={() => setShowAlert(false)}
                            className="absolute top-0 right-0 px-4 py-3"
                        >
                            <span
                                className={`
                                  text-neutral-700
                                  dark:text-neutral-300
                                  text-2xl
                                `}
                            >
                                &times;
                            </span>
                        </button>
                        <strong className="font-bold">Message sent</strong>
                        <p className="text-sm mt-1">
                            I&apos;ll get back to you soon.
                        </p>
                    </div>
                )}

                {showAlert && serverError && (
                    <div
                        className={`
                          bg-red-100
                          dark:bg-red-900/20
                          border border-red-400
                          dark:border-red-600
                          text-red-700
                          dark:text-red-400
                          px-4 py-3 rounded-lg relative
                        `}
                        role="alert"
                    >
                        <button
                            onClick={() => setShowAlert(false)}
                            className="absolute top-0 right-0 px-4 py-3"
                        >
                            <span
                                className={`
                                  text-red-700
                                  dark:text-red-400
                                  text-2xl
                                `}
                            >
                                &times;
                            </span>
                        </button>
                        <strong className="font-bold">
                            Something went wrong
                        </strong>
                        <p className="text-sm mt-1">
                            Please try again or email me directly at{" "}
                            <a
                                className="hover:underline"
                                href="mailto:hello@panchamkhaitan.com"
                            >
                                hello@panchamkhaitan.com
                            </a>
                        </p>
                    </div>
                )}

                <form onSubmit={handleContactFormSubmit} className="space-y-6">
                    <div
                        className={`
                          grid grid-cols-1 gap-6
                          md:grid-cols-2
                        `}
                    >
                        <div>
                            <label
                                htmlFor="firstName"
                                className={`
                                  block text-sm font-medium text-black
                                  dark:text-white
                                  mb-2
                                `}
                            >
                                Your first name
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                ref={visitorFirstName}
                                name="first-name"
                                required
                                className={`
                                  w-full px-4 py-3 border border-gray-300
                                  dark:border-gray-700
                                  bg-white
                                  dark:bg-gray-900
                                  text-black
                                  dark:text-white
                                  rounded-md
                                  focus:outline-none focus:ring-2
                                  focus:ring-[var(--color-accent)]
                                  focus:border-transparent
                                  transition-all duration-200
                                `}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="lastName"
                                className={`
                                  block text-sm font-medium text-black
                                  dark:text-white
                                  mb-2
                                `}
                            >
                                Your last name
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                ref={visitorLastName}
                                name="last-name"
                                required
                                className={`
                                  w-full px-4 py-3 border border-gray-300
                                  dark:border-gray-700
                                  bg-white
                                  dark:bg-gray-900
                                  text-black
                                  dark:text-white
                                  rounded-md
                                  focus:outline-none focus:ring-2
                                  focus:ring-[var(--color-accent)]
                                  focus:border-transparent
                                  transition-all duration-200
                                `}
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className={`
                              block text-sm font-medium text-black
                              dark:text-white
                              mb-2
                            `}
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            ref={visitorEmail}
                            name="email"
                            required
                            onChange={handleInputChange}
                            className={`
                              w-full px-4 py-3 border border-gray-300
                              dark:border-gray-700
                              bg-white
                              dark:bg-gray-900
                              text-black
                              dark:text-white
                              rounded-md
                              focus:outline-none focus:ring-2
                              focus:ring-[var(--color-accent)]
                              focus:border-transparent
                              transition-all duration-200
                            `}
                        />
                        <p
                            className={`
                              mt-1 text-sm text-custom-grey
                              dark:text-gray-400
                            `}
                        >
                            I&apos;ll never share your email with anyone else.
                        </p>
                        {error.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {error.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="subject"
                            className={`
                              block text-sm font-medium text-black
                              dark:text-white
                              mb-2
                            `}
                        >
                            Subject
                        </label>
                        <input
                            id="subject"
                            type="text"
                            ref={visitorSubject}
                            name="subject"
                            required
                            className={`
                              w-full px-4 py-3 border border-gray-300
                              dark:border-gray-700
                              bg-white
                              dark:bg-gray-900
                              text-black
                              dark:text-white
                              rounded-md
                              focus:outline-none focus:ring-2
                              focus:ring-[var(--color-accent)]
                              focus:border-transparent
                              transition-all duration-200
                            `}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="message"
                            className={`
                              block text-sm font-medium text-black
                              dark:text-white
                              mb-2
                            `}
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            ref={visitorMessage}
                            name="message"
                            required
                            rows={5}
                            className={`
                              w-full px-4 py-3 border border-gray-300
                              dark:border-gray-700
                              bg-white
                              dark:bg-gray-900
                              text-black
                              dark:text-white
                              rounded-md
                              focus:outline-none focus:ring-2
                              focus:ring-[var(--color-accent)]
                              focus:border-transparent
                              transition-all duration-200 resize-none
                            `}
                        />
                    </div>

                    <div>
                        <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
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
                        {turnstileError && (
                            <p className={`
                              mt-2 text-sm text-red-600
                              dark:text-red-400
                            `}>
                                Please complete the verification to continue.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`
                          primary-button
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {isSubmitting ? "Sending..." : "Send message"}
                    </button>
                </form>

                <p
                    className={`
                      text-neutral-600
                      dark:text-neutral-400
                    `}
                >
                    You can also shoot me an email at{" "}
                    <a
                        className="hover:underline"
                        href="mailto:hello@panchamkhaitan.com"
                    >
                        hello@panchamkhaitan.com
                    </a>
                </p>
            </div>
        </div>
    );
}
