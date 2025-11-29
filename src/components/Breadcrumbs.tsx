"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const { pageTitle } = useBreadcrumb();

    if (!pathname || pathname === "/") {
        return null;
    }

    const capitalize = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1);

    const parts = pathname.split("/").filter(Boolean);
    const crumbs = parts
        .map((part, idx) => {
            const href = "/" + parts.slice(0, idx + 1).join("/");
            const isLast = idx === parts.length - 1;

            // For the last segment, only show it if we have a pageTitle
            if (isLast) {
                return pageTitle ? { label: pageTitle, href } : null;
            }

            // For intermediate segments, capitalize them
            return { label: capitalize(part), href };
        })
        .filter(Boolean) as { label: string; href: string }[];

    return (
        <nav aria-label="Breadcrumb" className="text-xs text-neutral-500 mb-4">
            <ol className="flex items-center gap-1">
                <li>
                    <Link href="/" className="hover:underline">
                        Home
                    </Link>
                </li>
                {crumbs.map((c, i) => (
                    <li key={c.href} className="flex items-center gap-1">
                        <span>/</span>
                        {i < crumbs.length - 1 ? (
                            <Link href={c.href} className="hover:underline">
                                {c.label}
                            </Link>
                        ) : (
                            <span
                                className={`
                                  text-neutral-700
                                  dark:text-neutral-300
                                `}
                            >
                                {c.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
