"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS } from "@/data/site";

type SiteNavProps = {
    /** Extra class on the <nav> */
    className?: string;
    /** Called after a link is activated (mobile drawer closes) */
    onNavigate?: () => void;
    /** Visual layout */
    variant?: "desktop" | "mobile";
};

/** Same sections as the index map — one source of truth. */
export default function SiteNav({
    className = "",
    onNavigate,
    variant = "desktop",
}: SiteNavProps) {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(`${href}/`);

    const isMobile = variant === "mobile";

    return (
        <nav
            aria-label="Primary"
            className={[
                "site-nav",
                isMobile ? "site-nav--mobile" : "site-nav--desktop",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {SECTIONS.map((item, i) => {
                const active = isActive(item.href);
                return (
                    <span key={item.href} className="site-nav__unit">
                        {!isMobile && i > 0 && (
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
                            onClick={() => onNavigate?.()}
                        >
                            <span className="site-nav__label">{item.label}</span>
                            {isMobile && item.hint ? (
                                <span className="site-nav__hint">{item.hint}</span>
                            ) : null}
                        </Link>
                    </span>
                );
            })}
        </nav>
    );
}
