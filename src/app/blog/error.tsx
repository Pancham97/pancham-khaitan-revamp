"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function BlogError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Blog error:", error);
    }, [error]);

    return (
        <div
            className={`
              min-h-screen bg-white
              dark:bg-black
              flex items-center justify-center
            `}
        >
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 font-serif">
                    Something went wrong!
                </h2>
                <p className="text-gray-600 mb-6">
                    We couldn&apos;t load the blog posts. Please try again.
                </p>
                <div className="space-x-4">
                    <button
                        onClick={reset}
                        className={`
                          px-6 py-3 bg-blue-600 text-white font-medium
                          rounded-md
                          hover:bg-blue-700
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          focus:ring-offset-2
                        `}
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className={`
                          inline-block px-6 py-3 bg-gray-200 text-gray-800
                          font-medium rounded-md
                          hover:bg-gray-300
                          focus:outline-none focus:ring-2 focus:ring-gray-500
                          focus:ring-offset-2
                        `}
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}
