"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";
import {
    Archive,
    Briefcase,
    Contact,
    Github,
    Home,
    Linkedin,
    Mail,
    Megaphone,
    Menu,
    MoveUpRight,
    Newspaper,
    NotebookPen,
    Search,
    User,
    X,
} from "lucide-react";

function IconHome() {
    return (
        <Home className="w-4 h-4 mr-2" strokeWidth={1.5} aria-hidden="true" />
    );
}
function IconWork() {
    return (
        <Briefcase
            className="w-4 h-4 mr-2"
            strokeWidth={1.5}
            aria-hidden="true"
        />
    );
}
function IconBlog() {
    return (
        <Newspaper
            className="w-4 h-4 mr-2"
            strokeWidth={1.5}
            aria-hidden="true"
        />
    );
}
function IconNotes() {
    return (
        <NotebookPen
            className="w-4 h-4 mr-2"
            strokeWidth={1.5}
            aria-hidden="true"
        />
    );
}
function IconUpdates() {
    return (
        <Megaphone
            className="w-4 h-4 mr-2"
            strokeWidth={1.5}
            aria-hidden="true"
        />
    );
}
function IconAbout() {
    return (
        <User className="w-4 h-4 mr-2" strokeWidth={1.5} aria-hidden="true" />
    );
}
function IconContact() {
    return (
        <Contact
            className="w-4 h-4 mr-2"
            strokeWidth={1.5}
            aria-hidden="true"
        />
    );
}
function IconEmail() {
    return (
        <Mail className="w-4 h-4 mr-2" strokeWidth={1.5} aria-hidden="true" />
    );
}
function IconTwitter() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-twitter-x ml-0 mr-2"
            viewBox="0 0 16 16"
            id="Twitter-X--Streamline-Bootstrap"
            height="16"
            width="16"
            aria-hidden="true"
        >
            <desc>Twitter X Streamline Icon: https://streamlinehq.com</desc>
            <path
                d="M12.6 0.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867 -5.07 -4.425 5.07H0.316l5.733 -6.57L0 0.75h5.063l3.495 4.633L12.601 0.75Zm-0.86 13.028h1.36L4.323 2.145H2.865z"
                strokeWidth="1"
            />
        </svg>
    );
}
function IconGitHub() {
    return (
        <Github className="w-4 h-4 mr-2" strokeWidth={1.5} aria-hidden="true" />
    );
}
function IconLinkedIn() {
    return (
        <Linkedin
            className="w-4 h-4 mr-2"
            strokeWidth={1.5}
            aria-hidden="true"
        />
    );
}
function IconExternal() {
    return (
        <MoveUpRight className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
    );
}
function IconOld() {
    return (
        <Archive
            className="w-4 h-4 mr-2"
            strokeWidth={1.5}
            aria-hidden="true"
        />
    );
}

const links = [
    { href: "/", label: "Home", key: "H", Icon: IconHome },
    { href: "/work", label: "Work", key: "W", Icon: IconWork },
    { href: "/blog", label: "Blog", key: "B", Icon: IconBlog },
    { href: "/updates", label: "Updates", key: "U", Icon: IconUpdates },
    { href: "/notes", label: "Notes", key: "N", Icon: IconNotes },
    { href: "/about", label: "About", key: "A", Icon: IconAbout },
    { href: "/contact", label: "Contact", key: "C", Icon: IconContact },
];

const externalLinks = [
    {
        href: "mailto:hello@panchamkhaitan.com",
        label: "Email",
        Icon: IconEmail,
    },
    {
        href: "https://x.com/PanchamKhaitan",
        label: "Twitter / X",
        ext: true,
        Icon: IconTwitter,
    },
    {
        href: "https://github.com/Pancham97",
        label: "GitHub",
        ext: true,
        Icon: IconGitHub,
    },
    {
        href: "https://linkedin.com/in/panchamkhaitan/",
        label: "LinkedIn",
        ext: true,
        Icon: IconLinkedIn,
    },
    // {
    //     href: "https://v0.panchamkhaitan.com",
    //     label: "Old site (v0)",
    //     ext: true,
    //     Icon: IconOld,
    // },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const drawerRef = useRef<HTMLDivElement | null>(null);
    const openCommandPalette = () => {
        if (typeof window === "undefined") {
            return;
        }
        window.dispatchEvent(new Event("command-palette:open"));
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Simple focus trap when drawer is open
    useEffect(() => {
        if (!open) {
            return;
        }
        const el = drawerRef.current;
        if (!el) {
            return;
        }
        const focusables = Array.from(
            el.querySelectorAll<HTMLElement>(
                'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
            ),
        ).filter((n) => !n.hasAttribute("disabled"));
        focusables[0]?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab" || focusables.length === 0) {
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        el.addEventListener("keydown", onKeyDown);
        return () => el.removeEventListener("keydown", onKeyDown);
    }, [open]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (!open) {
            return;
        }
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    return (
        <>
            <aside
                className={`
                  border-neutral-200
                  dark:border-neutral-950
                  bg-[var(--background)] text-[var(--foreground)]
                  md:fixed md:inset-y-0 md:w-[18.5rem] md:border-r-1 md:flex
                  md:flex-col
                  w-full border-b
                  md:border-b-0
                  overflow-x-hidden
                `}
            >
                <div
                    className={`
                      md:flex md:flex-col
                      px-4
                      md:px-6
                    `}
                >
                    <div
                        className={`
                          h-14
                          md:h-16
                          flex w-full items-center justify-between
                          md:gap-3
                        `}
                    >
                        <Link
                            href="/"
                            className={`
                              no-underline text-md font-mono tracking-tight
                            `}
                        >
                            Pancham Khaitan
                        </Link>
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <button
                                aria-label="Toggle navigation"
                                onClick={() => setOpen(true)}
                                className={`
                                  rounded p-1
                                  hover:bg-neutral-100
                                  dark:hover:bg-white/10
                                  md:hidden
                                `}
                            >
                                <Menu
                                    className="h-5 w-5"
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={openCommandPalette}
                        className={`
                          hidden
                          md:inline-flex
                          justify-between items-center gap-1 rounded border
                          border-neutral-200 bg-white/95 px-2 py-2 text-sm
                          font-medium text-neutral-700 shadow-sm
                          hover:bg-white hover:text-neutral-950
                          focus-visible:outline-none focus-visible:ring-2
                          focus-visible:ring-black/30
                          cursor-text
                          dark:border-white/10 dark:bg-black/90 dark:text-white
                          dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]
                          dark:hover:bg-white/10 dark:hover:text-white
                          dark:focus-visible:ring-white/30
                        `}
                        aria-label="Open search"
                    >
                        <div className="flex items-center gap-2">
                            <Search
                                className="h-3.5 w-3.5"
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                            Search
                        </div>
                        <kbd
                            className={`
                              rounded border border-neutral-200 px-1.5 py-0.5
                              font-mono text-[10px] text-neutral-500
                              dark:border-neutral-700 dark:text-neutral-400
                            `}
                        >
                            ⌘ K
                        </kbd>
                    </button>

                    <nav
                        aria-label="Primary"
                        className={`
                          py-2
                          md:py-4
                        `}
                    >
                        <div
                            className={`
                              hidden
                              md:block
                              px-2 text-[10px] uppercase tracking-wide
                              text-neutral-500 mb-1
                            `}
                        >
                            Main
                        </div>
                        <ul
                            className={`
                              hidden
                              md:block md:space-y-1
                            `}
                        >
                            {links.map((l) => {
                                const active =
                                    l.href === "/"
                                        ? pathname === "/"
                                        : pathname === l.href ||
                                          pathname.startsWith(l.href + "/");
                                return (
                                    <li key={l.href}>
                                        <Link
                                            href={l.href}
                                            className={`
                                              group flex items-center
                                              justify-between gap-2 rounded px-2
                                              py-1.5 text-sm no-underline
                                              ${
                                    active
                                        ? `
                                          bg-black
                                          dark:bg-white/80
                                          active-nav-link
                                        `
                                        : `
                                          hover:bg-neutral-100/90
                                          dark:hover:bg-white/10
                                          transition-none!
                                        `
                                    }
                                            `}
                                        >
                                            <span
                                                className={`
                                                  flex items-center gap-2
                                                  ${
                                    active
                                        ? `
                                          text-white
                                          dark:text-black
                                        `
                                        : `
                                          text-neutral-600
                                          dark:text-neutral-300
                                          group-hover:text-neutral-900
                                          dark:group-hover:text-white
                                        `
                                    }
                                                `}
                                            >
                                                <l.Icon />
                                                <span className="leading-none">
                                                    {l.label}
                                                </span>
                                            </span>
                                            <kbd
                                                className={`
                                                  text-xs px-1.5 py-0.5 rounded
                                                  border font-mono
                                                  ${
                                    active
                                        ? `
                                          text-white border-white
                                          dark:border-black
                                          bg-white/20
                                          dark:bg-black
                                        `
                                        : `
                                          border-neutral-300
                                          dark:border-neutral-700
                                          bg-neutral-50
                                          dark:bg-black/80
                                          text-neutral-500
                                          dark:text-white
                                          group-hover:bg-neutral-200
                                          dark:group-hover:bg-white/10
                                          group-hover:border-neutral-400
                                          dark:group-hover:border-white/30
                                          group-hover:text-neutral-800
                                          dark:group-hover:text-white
                                        `
                                    }
                                                `}
                                            >
                                                {l.key}
                                            </kbd>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div
                        className={`
                          hidden
                          md:block
                          py-4 border-t border-neutral-200
                          dark:border-neutral-800
                          text-sm
                          md:mt-auto
                        `}
                    >
                        <div
                            className={`
                              px-0 text-[10px] uppercase tracking-wide
                              text-neutral-500 mb-1
                            `}
                        >
                            Links
                        </div>
                        <div className="flex flex-col gap-1">
                            {externalLinks.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    target={item.ext ? "_blank" : undefined}
                                    rel={item.ext ? "noreferrer" : undefined}
                                    className={`
                                      group flex items-center justify-between
                                      gap-2 rounded px-2 py-1.5 no-underline
                                      hover:bg-neutral-100/90
                                      dark:hover:bg-white/10
                                      transition-none!
                                    `}
                                >
                                    <span
                                        className={`
                                          flex items-center gap-2
                                          text-neutral-600
                                          group-hover:text-neutral-900
                                          dark:text-neutral-300
                                          dark:group-hover:text-white
                                        `}
                                    >
                                        <item.Icon />
                                        <span className="leading-none">
                                            {item.label}
                                        </span>
                                    </span>
                                    <span
                                        className={`
                                          text-xs p-1.5 rounded border
                                          border-neutral-200
                                          dark:border-neutral-800
                                          text-neutral-500
                                          group-hover:border-neutral-400
                                          dark:group-hover:border-white/30
                                        `}
                                    >
                                        <IconExternal />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
            {open && (
                <div className="fixed inset-0 z-50">
                    {/* <div className="md:hidden fixed inset-0 z-50"> */}
                    <button
                        aria-label="Close navigation"
                        onClick={() => setOpen(false)}
                        className={`
                          absolute inset-0 bg-black/60 transition-opacity
                        `}
                    />
                    <div
                        ref={drawerRef}
                        className={`
                          absolute left-0 top-0 bottom-0 w-72
                          bg-[var(--background)] text-[var(--foreground)]
                          border-r border-neutral-200
                          dark:border-neutral-800
                          p-4 shadow-xl transition-transform duration-200
                          ease-out will-change-transform translate-x-0
                        `}
                        style={{ transform: "translateX(0)" }}
                    >
                        <div
                            className={`
                              flex items-center justify-between h-10 mb-2
                            `}
                        >
                            <span className="text-sm font-semibold">Menu</span>
                            <button
                                onClick={() => setOpen(false)}
                                className={`
                                  rounded p-1
                                  hover:bg-neutral-100
                                  dark:hover:bg-white/10
                                `}
                            >
                                <X
                                    className="h-5 w-5"
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                openCommandPalette();
                                setOpen(false);
                            }}
                            className={`
                              group flex items-center justify-between w-full
                              gap-2 rounded px-2 py-1.5 mb-3 border-1 text-sm
                              hover:bg-neutral-100
                              dark:hover:bg-white/10
                            `}
                        >
                            <span className="flex items-center text-inherit">
                                <Search
                                    className="mr-2 h-4 w-4"
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                                Search
                            </span>
                            <kbd
                                className={`
                                  text-[10px] px-1.5 py-0.5 rounded border
                                  border-neutral-300 bg-neutral-50 font-mono
                                  dark:border-neutral-700 dark:bg-neutral-900
                                `}
                            >
                                ⌘ K
                            </kbd>
                        </button>
                        <nav className="space-y-1">
                            {links.map((l) => {
                                const active =
                                    l.href === "/"
                                        ? pathname === "/"
                                        : pathname === l.href ||
                                          pathname.startsWith(l.href + "/");
                                return (
                                    <Link
                                        key={l.href}
                                        href={l.href}
                                        onClick={() => setOpen(false)}
                                        className={`
                                          group flex items-center
                                          justify-between gap-2 rounded px-2
                                          py-2 text-sm no-underline
                                          transition-none!
                                          ${
                                    active
                                        ? `
                                          bg-neutral-900
                                          dark:bg-white/80
                                          text-white
                                          dark:text-black
                                        `
                                        : `
                                          hover:bg-neutral-100/90
                                          dark:hover:bg-white/10
                                        `
                                    }
                                        `}
                                    >
                                        <span
                                            className={`
                                              flex items-center gap-2
                                              ${
                                    active
                                        ? `
                                          text-white
                                          dark:text-black
                                        `
                                        : `
                                          text-neutral-700
                                          group-hover:text-neutral-900
                                          dark:text-neutral-300
                                          dark:group-hover:text-white
                                        `
                                    }
                                            `}
                                        >
                                            <l.Icon />
                                            <span className="leading-none">
                                                {l.label}
                                            </span>
                                        </span>
                                        <kbd
                                            className={`
                                              text-[10px] px-1.5 py-0.5 rounded
                                              border font-mono
                                              ${
                                    active
                                        ? `
                                          text-white border-white
                                          dark:border-black
                                          bg-white/20
                                          dark:bg-black
                                        `
                                        : `
                                          border-neutral-300
                                          dark:border-neutral-700
                                          bg-neutral-50
                                          dark:bg-neutral-900
                                          text-neutral-500
                                          dark:text-neutral-400
                                          group-hover:bg-neutral-200
                                          dark:group-hover:bg-white/10
                                          group-hover:border-neutral-400
                                          dark:group-hover:border-white/30
                                          group-hover:text-neutral-800
                                        `
                                    }
                                            `}
                                        >
                                            {l.key}
                                        </kbd>
                                    </Link>
                                );
                            })}
                        </nav>
                        <div
                            className={`
                              mt-4 pt-2 border-t border-neutral-200
                              dark:border-neutral-800
                              space-y-1 text-sm
                            `}
                        >
                            {externalLinks.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    target={item.ext ? "_blank" : undefined}
                                    rel={item.ext ? "noreferrer" : undefined}
                                    className={`
                                      group flex items-center justify-between
                                      gap-2 rounded px-2 py-1.5
                                      hover:bg-neutral-100
                                      dark:hover:bg-white/10
                                      focus-visible:bg-neutral-900
                                      focus-visible:text-white
                                      no-underline transition-none!
                                    `}
                                >
                                    <span className="flex items-center">
                                        <item.Icon />
                                        {item.label}
                                    </span>
                                    <span
                                        className={`
                                          text-[10px] px-1.5 py-0.5 rounded-full
                                          border border-neutral-200
                                          dark:border-neutral-800
                                          text-neutral-500
                                          group-hover:border-neutral-400
                                          dark:group-hover:border-white/30
                                        `}
                                    >
                                        <IconExternal />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
