import type { ReactNode } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import SiteNav from "@/components/SiteNav";
import ClientOverlays from "@/components/ClientOverlays";
import SearchTrigger from "@/components/SearchTrigger";
import { FOLLOW, SOCIALS } from "@/data/site";

/**
 * Minimal chrome: monogram + theme + search, full-width nav.
 * Name and role live on the index.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
    return (
        <div className="site-shell">
            <a href="#main" className="skip-link">
                Skip to content
            </a>

            <div className="site-frame">
                <header className="site-top">
                    <div className="site-top__row">
                        <Link
                            href="/"
                            className="site-brand"
                            aria-label="Home"
                        >
                            <span className="site-brand__mark" aria-hidden>
                                pk
                            </span>
                        </Link>
                        <div className="site-top__actions">
                            <SearchTrigger />
                            <ThemeToggle />
                        </div>
                    </div>
                    <SiteNav />
                </header>

                <main id="main" className="site-main" tabIndex={-1}>
                    {children}
                </main>

                <footer className="site-footer">
                    <nav aria-label="Site footer" className="site-footer__line">
                        <span className="site-footer__item site-footer__year">
                            © {new Date().getFullYear()}
                        </span>
                        {/* Follow first, then socials — dedupe by href */}
                        {[
                            ...FOLLOW.map((f) => ({
                                label: f.label,
                                href: f.href,
                                external: f.external,
                            })),
                            ...SOCIALS.filter(
                                (s) =>
                                    s.label !== "Email" &&
                                    !FOLLOW.some((f) => f.href === s.href),
                            ),
                        ].map((link) => (
                            <span key={link.href} className="site-footer__unit">
                                <span className="site-footer__sep" aria-hidden>
                                    {" · "}
                                </span>
                                <a
                                    href={link.href}
                                    target={
                                        link.external ? "_blank" : undefined
                                    }
                                    rel={
                                        link.external
                                            ? "noreferrer"
                                            : undefined
                                    }
                                    className="site-footer__item"
                                >
                                    {link.label}
                                </a>
                            </span>
                        ))}
                    </nav>
                </footer>
            </div>

            <ClientOverlays />
        </div>
    );
}
