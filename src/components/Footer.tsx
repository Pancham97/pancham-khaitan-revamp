"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import validateEmail from "@/lib/validateEmail";
import { Github, Linkedin, Twitter } from "lucide-react";

const socialLinks = [
    {
        platformName: "GitHub",
        profileUrl: "https://github.com/Pancham97",
        Icon: Github,
    },
    {
        platformName: "Twitter",
        profileUrl: "https://twitter.com/PanchamKhaitan",
        Icon: Twitter,
    },
    {
        platformName: "LinkedIn",
        profileUrl: "https://linkedin.com/in/panchamkhaitan/",
        Icon: Linkedin,
    },
];

const Footer = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const emailRef = useRef<HTMLInputElement | null>(null);

    const handleInputChange = () => {
        setEmailError("");
    };

    const handleSubscriptionFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const emailValue = emailRef.current?.value ?? "";

        if (!emailValue) {
            setEmailError("Please enter your email address.");
            return;
        }

        if (!validateEmail(emailValue)) {
            setEmailError("This email is not valid. Kindly check again.");
            return;
        }

        setIsSubmitting(true);
        setEmailError("");

        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailValue }),
            });

            if (!response.ok) {
                throw new Error("Failed to subscribe");
            }

            setShowAlert(true);
            setServerError(false);

            if (emailRef.current) {
                emailRef.current.value = "";
            }
        } catch (error) {
            console.error("Error subscribing:", error);
            setShowAlert(true);
            setServerError(true);
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                setShowAlert(false);
            }, 20000);
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-phantom-black text-white py-20">
            {/* Success/Error Alert */}
            {showAlert && (
                <div
                    className={`
                      fixed bottom-0 left-1/2 z-50 w-full transform
                      -translate-x-1/2 rounded-t-lg p-4
                      lg:w-1/2
                      ${
                serverError
                    ? "bg-neutral-950 text-white"
                    : "bg-neutral-200 text-neutral-900"
                }
                    `}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3
                                className={`
                                  font-bold text-lg mb-2 uppercase tracking-wide
                                `}
                            >
                                {serverError ? "Uh oh!" : "Thank you!"}
                            </h3>
                            <p className="text-sm leading-relaxed">
                                {serverError ? (
                                    <>
                                        Something&apos;s wrong. Please try
                                        again... If you don&apos;t see a success
                                        message, please contact me on{" "}
                                        <a
                                            href="mailto:hello@panchamkhaitan.com"
                                            className="underline"
                                        >
                                            hello@panchamkhaitan.com
                                        </a>
                                        . I will really appreciate your
                                        proactive response. Thank you!
                                    </>
                                ) : (
                                    "I really appreciate you taking interest in my thoughts and works. I have sent you an email as an acknowledgment. I promise to never spam you. If you don’t get an email in the next fifteen minutes, please don’t worry. It’s probably my email service that’s creating a problem. Have a great day ahead!"
                                )}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAlert(false)}
                            className={`
                              text-xl font-bold
                              ${
                serverError
                    ? `
                      text-white
                      hover:text-neutral-300
                    `
                    : `
                      text-neutral-900
                      hover:text-neutral-700
                    `
                }
                            `}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4">
                <div
                    className={`
                      grid grid-cols-1
                      md:grid-cols-2
                      lg:grid-cols-12
                      gap-8
                    `}
                >
                    {/* Logo/Brand */}
                    <div className="lg:col-span-4">
                        <Link
                            href="/"
                            className={`
                              text-2xl
                              lg:text-3xl
                              font-bold text-white no-underline
                              hover:opacity-80
                            `}
                        >
                            Pancham Khaitan
                        </Link>
                    </div>

                    {/* Newsletter Signup and Social Links */}
                    <div className="lg:col-span-4 lg:col-start-9">
                        {/* Newsletter Signup */}
                        <form
                            onSubmit={handleSubscriptionFormSubmit}
                            className="mb-8"
                        >
                            <label
                                className={`
                                  block text-white text-lg font-medium mb-3
                                `}
                            >
                                Sign up for updates
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    ref={emailRef}
                                    placeholder="Enter your email"
                                    onChange={handleInputChange}
                                    className={`
                                      w-full px-4 py-3 pr-28 rounded-none
                                      transition-all duration-300 border
                                      border-neutral-300
                                      dark:border-neutral-700
                                      bg-white
                                      dark:bg-gray-900
                                      text-black
                                      dark:text-white
                                      placeholder-neutral-500
                                      dark:placeholder-neutral-400
                                      ${emailError ? "border-2 border-red-500" : ""}
                                    `}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`
                                      absolute right-1 top-1 bottom-1
                                      primary-button px-4 py-2 rounded-none
                                      font-medium
                                      disabled:opacity-50
                                    `}
                                >
                                    {isSubmitting ? "..." : "I'm in"}
                                </button>
                            </div>
                            {emailError && (
                                <p className="text-red-400 text-sm mt-2">
                                    {emailError}
                                </p>
                            )}
                            <p className="text-custom-grey text-sm mt-2">
                                Please enter your email address if you want to
                                know what I am up to.
                            </p>
                        </form>

                        {/* Social Links */}
                        <div>
                            <h3
                                className={`
                                  text-custom-grey text-lg font-medium mb-4
                                `}
                            >
                                Connect with me
                            </h3>
                            <ul className="space-y-2">
                                {socialLinks.map((social, key) => (
                                    <li key={key}>
                                        <a
                                            href={social.profileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`
                                              flex items-center text-white
                                              hover:opacity-80
                                              px-2 py-1 rounded transition-all
                                              duration-300 no-underline
                                            `}
                                        >
                                            <social.Icon
                                                className="w-5 h-5 mr-3"
                                                strokeWidth={1.5}
                                                aria-hidden="true"
                                            />
                                            {social.platformName}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-12 pt-8">
                    <div className="flex flex-col text-custom-grey text-sm">
                        <span className="font-bold">
                            © {currentYear} Pancham Khaitan
                        </span>
                        <span>All rights reserved.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
