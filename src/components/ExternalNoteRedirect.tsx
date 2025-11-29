"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ExternalNoteRedirectProps {
    title: string;
    externalUrl: string;
}

export default function ExternalNoteRedirect({
    title,
    externalUrl,
}: ExternalNoteRedirectProps) {
    useEffect(() => {
        // Open in new tab
        window.open(externalUrl, "_blank", "noopener,noreferrer");
    }, [externalUrl]);

    return (
        <div
            className={`
              min-h-screen bg-white
              dark:bg-black
              flex items-center justify-center
            `}
        >
            <div className="text-center max-w-md mx-auto p-8">
                <h1
                    className={`
                      text-2xl font-bold text-black
                      dark:text-white
                      mb-4
                    `}
                >
                    Opening &quot;{title}&quot;
                </h1>
                <p className="text-custom-grey mb-6">
                    This note is hosted on Notion. It should open in a new tab
                    automatically.
                </p>
                <p className="text-custom-grey mb-8">
                    If it doesn&apos;t open, you can{" "}
                    <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        click here to open it manually
                    </a>
                    .
                </p>
                <Link
                    href="/notes"
                    className={`
                      inline-flex items-center text-black
                      dark:text-white
                      transition-colors duration-300 group
                      hover:opacity-80
                    `}
                >
                    <span
                        className={`
                          mr-2 transform
                          group-hover:-translate-x-2
                          transition-transform duration-300
                        `}
                    >
                        ←
                    </span>
                    <span>Back to Notes</span>
                </Link>
            </div>
        </div>
    );
}
