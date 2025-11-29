"use client";

import React from "react";
import ClientOverlays from "./ClientOverlays";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";

export default function MinimalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <BreadcrumbProvider>
            <div
                className={`
                  min-h-dvh bg-[var(--background)] text-[var(--foreground)]
                `}
            >
                <a href="#main" className="skip-link">
                    Skip to content
                </a>
                <Sidebar />
                <div
                    className={`
                      md:pl-[18.5rem]
                      flex flex-col min-h-dvh
                    `}
                >
                    <main
                        id="main"
                        className={`
                          px-4
                          md:px-8
                          pt-6 pb-12 flex-1
                        `}
                    >
                        <div className="mx-auto w-full max-w-3xl">
                            <Breadcrumbs />
                            {children}
                        </div>
                    </main>
                </div>
                <ClientOverlays />
            </div>
        </BreadcrumbProvider>
    );
}
