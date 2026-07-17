"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS } from "@/data/site";

/** Same sections as the index map — one source of truth. */
export default function SiteNav() {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(`${href}/`);

    return (
        <nav aria-label="Primary" className="site-nav">
            {SECTIONS.map((item, i) => {
                const active = isActive(item.href);
                return (
                    <span key={item.href} className="site-nav__unit">
                        {i > 0 && (
                            <span className="site-nav__sep" aria-hidden>
                                {" · "}
                            </span>
                        )}
                        <Link
                            href={item.href}
                            prefetch
                            className={
                                active
                                    ? "site-nav__link is-active"
                                    : "site-nav__link"
                            }
                            aria-current={active ? "page" : undefined}
                        >
                            {item.label}
                        </Link>
                    </span>
                );
            })}
        </nav>
    );
}
