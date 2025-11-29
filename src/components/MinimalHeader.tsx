"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const links = [
    { href: "/", label: "Home" },
    { href: "/work", label: "Work" },
    { href: "/blog", label: "Blog" },
    { href: "/notes", label: "Notes" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function MinimalHeader() {
    const pathname = usePathname();

    return (
        <header
            className={`
              fixed top-0 left-0 right-0 z-50 bg-white/95
              dark:bg-black/95
              backdrop-blur
              supports-[backdrop-filter]:shadow-sm
            `}
        >
            <div className="mx-auto max-w-5xl px-4">
                <div className="flex h-14 items-center justify-between">
                    <Link
                        href="/"
                        className={`
                          no-underline text-sm font-semibold tracking-tight
                          text-black
                          dark:text-white
                        `}
                    >
                        Pancham Khaitan
                    </Link>
                    <nav
                        aria-label="Primary"
                        className="flex items-center gap-4"
                    >
                        {links.map((l) => {
                            const active = pathname === l.href;
                            return (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className={`
                                      text-sm no-underline text-black
                                      dark:text-white
                                      hover:underline
                                      underline-offset-4
                                      ${active ? "underline" : ""}
                                    `}
                                >
                                    {l.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </header>
    );
}
