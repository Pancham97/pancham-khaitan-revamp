"use client";

import {
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
    type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import SiteNav from "@/components/SiteNav";
import ClientOverlays from "@/components/ClientOverlays";
import SearchTrigger from "@/components/SearchTrigger";
import { FOLLOW, SOCIALS } from "@/data/site";

/**
 * Quiet chrome: wordmark + search/theme + short desktop nav.
 * Mobile: list icon opens a vertical drawer; footer stacks vertically.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    /** Keep drawer mounted briefly so close animation can finish */
    const [menuMounted, setMenuMounted] = useState(false);
    const menuId = useId();
    const toggleRef = useRef<HTMLButtonElement | null>(null);
    const drawerRef = useRef<HTMLDivElement | null>(null);
    const closeTimerRef = useRef<number | null>(null);

    const closeMenu = useCallback((restoreFocus = true) => {
        setMenuOpen(false);
        if (restoreFocus) {
            // Focus after paint so the button is interactive again
            window.requestAnimationFrame(() => {
                toggleRef.current?.focus();
            });
        }
    }, []);

    const openMenu = useCallback(() => {
        if (closeTimerRef.current) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        setMenuMounted(true);
        // Next frame so the enter transition runs from the closed styles
        window.requestAnimationFrame(() => {
            setMenuOpen(true);
        });
    }, []);

    const toggleMenu = useCallback(() => {
        if (menuOpen) {
            closeMenu(false);
        } else {
            openMenu();
        }
    }, [menuOpen, closeMenu, openMenu]);

    // Unmount after close transition
    useEffect(() => {
        if (menuOpen) {
            setMenuMounted(true);
            return;
        }
        if (!menuMounted) {
            return;
        }
        closeTimerRef.current = window.setTimeout(() => {
            setMenuMounted(false);
            closeTimerRef.current = null;
        }, 280);
        return () => {
            if (closeTimerRef.current) {
                window.clearTimeout(closeTimerRef.current);
            }
        };
    }, [menuOpen, menuMounted]);

    // Close drawer on route change (no focus restore — content is the target)
    useEffect(() => {
        setMenuOpen(false);
        setMenuMounted(false);
    }, [pathname]);

    // After in-app navigation, move keyboard users to main content
    useEffect(() => {
        if (pathname === undefined) {
            return;
        }
        const main = document.getElementById("main");
        if (main instanceof HTMLElement) {
            // Only when focus is still on a nav control (not a form field)
            const active = document.activeElement;
            if (
                active instanceof HTMLElement &&
                (active.classList.contains("site-nav__link") ||
                    active.classList.contains("site-brand") ||
                    active.classList.contains("site-menu-toggle") ||
                    active.closest(".site-nav-drawer"))
            ) {
                main.focus({ preventScroll: true });
            }
        }
    }, [pathname]);

    // Body scroll lock + Escape + light focus trap while open
    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeMenu(true);
                return;
            }

            if (event.key !== "Tab" || !drawerRef.current) {
                return;
            }

            // Include the header toggle so Shift+Tab can leave the list cleanly
            const drawerFocusable = Array.from(
                drawerRef.current.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
                ),
            ).filter(
                (el) =>
                    el.offsetParent !== null || el === toggleRef.current,
            );

            const chain = [toggleRef.current, ...drawerFocusable].filter(
                (el): el is HTMLElement => Boolean(el),
            );
            if (chain.length === 0) {
                return;
            }

            const first = chain[0];
            const last = chain[chain.length - 1];
            const active = document.activeElement;

            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        window.addEventListener("keydown", onKeyDown);

        const focusTimer = window.setTimeout(() => {
            const first = drawerRef.current?.querySelector<HTMLElement>(
                "a[href]",
            );
            first?.focus();
        }, 40);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
            window.clearTimeout(focusTimer);
        };
    }, [menuOpen, closeMenu]);

    const footerLinks = [
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
    ];

    return (
        <div
            className={
                menuOpen ? "site-shell is-menu-open" : "site-shell"
            }
        >
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
                            onClick={() => closeMenu(false)}
                        >
                            <span className="site-brand__mark" aria-hidden>
                                pk
                            </span>
                        </Link>
                        <div className="site-top__actions">
                            <SearchTrigger />
                            <ThemeToggle />
                            <button
                                ref={toggleRef}
                                type="button"
                                className="site-menu-toggle"
                                aria-expanded={menuOpen}
                                aria-controls={menuId}
                                aria-label={
                                    menuOpen ? "Close menu" : "Open menu"
                                }
                                onClick={toggleMenu}
                            >
                                <span
                                    className="site-menu-toggle__icon"
                                    aria-hidden
                                >
                                    <List
                                        className={`
                                          site-menu-toggle__glyph
                                          site-menu-toggle__glyph--open
                                        `}
                                        size={20}
                                        strokeWidth={1.75}
                                    />
                                    <X
                                        className={`
                                          site-menu-toggle__glyph
                                          site-menu-toggle__glyph--close
                                        `}
                                        size={20}
                                        strokeWidth={1.75}
                                    />
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Desktop / tablet: inline middot nav */}
                    <SiteNav variant="desktop" />
                </header>

                <main id="main" className="site-main" tabIndex={-1}>
                    {children}
                </main>

                <footer className="site-footer">
                    <p className="site-footer__year">
                        © {new Date().getFullYear()}
                    </p>
                    <nav aria-label="Site footer" className="site-footer__line">
                        {footerLinks.map((link, i) => (
                            <span key={link.href} className="site-footer__unit">
                                {i > 0 && (
                                    <span
                                        className="site-footer__sep"
                                        aria-hidden
                                    >
                                        {" · "}
                                    </span>
                                )}
                                <a
                                    href={link.href}
                                    target={
                                        link.external ? "_blank" : undefined
                                    }
                                    rel={
                                        link.external
                                            ? "noopener noreferrer"
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

            {/* Mobile drawer + scrim — stay mounted while animating out */}
            {menuMounted && (
                <>
                    <button
                        type="button"
                        className={
                            menuOpen
                                ? "site-nav-backdrop is-open"
                                : "site-nav-backdrop"
                        }
                        aria-label="Close menu"
                        tabIndex={menuOpen ? 0 : -1}
                        onClick={() => closeMenu(true)}
                    />
                    <div
                        ref={drawerRef}
                        id={menuId}
                        className={
                            menuOpen
                                ? "site-nav-drawer is-open"
                                : "site-nav-drawer"
                        }
                        role="dialog"
                        aria-modal="true"
                        aria-label="Site menu"
                        inert={!menuOpen ? true : undefined}
                    >
                        <div className="site-nav-drawer__inner">
                            <p className="site-nav-drawer__label">Navigate</p>
                            <SiteNav
                                variant="mobile"
                                onNavigate={() => closeMenu(false)}
                            />
                        </div>
                    </div>
                </>
            )}

            <ClientOverlays />
        </div>
    );
}
