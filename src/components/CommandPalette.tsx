"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import CommandPaletteItem from "./CommandPaletteItem";

type Theme = "light" | "dark";

type Item = {
    label: string;
    href?: string;
    external?: boolean;
    meta?: string;
    shortcut?: string;
    action?: () => void;
};

const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusableElements(container: HTMLElement | null) {
    if (!container) {
        return [];
    }

    return Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((node) => node.offsetParent !== null && node.tabIndex >= 0);
}

function applyTheme(theme: Theme) {
    const setThemeScript = (
        window as Window & { __setTheme?: (value: Theme) => void }
    ).__setTheme;

    if (typeof setThemeScript === "function") {
        setThemeScript(theme);
    } else {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
            root.setAttribute("data-theme", "dark");
        } else {
            root.classList.remove("dark");
            root.setAttribute("data-theme", "light");
        }
        root.style.colorScheme = theme;
        const meta = document.querySelector('meta[name="color-scheme"]');
        if (meta) {
            meta.setAttribute("content", theme);
        }
    }

    try {
        localStorage.setItem("theme", theme);
    } catch {}

    // Broadcast theme change to all listeners
    window.dispatchEvent(
        new CustomEvent("theme-change", { detail: { theme } }),
    );
}

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);
    const router = useRouter();
    const [cursor, setCursor] = useState(0);
    const prevCursorRef = useRef(0);
    const [theme, setTheme] = useState<Theme>("light");
    const [showTopShadow, setShowTopShadow] = useState(false);
    const [showBottomShadow, setShowBottomShadow] = useState(false);

    const openPalette = useCallback(() => {
        setQ("");
        setCursor(0);
        prevCursorRef.current = 0;
        setOpen(true);
    }, []);

    const closePalette = useCallback(() => {
        setOpen(false);
    }, []);

    const togglePalette = useCallback(() => {
        setOpen((isOpen) => !isOpen);
    }, []);

    // Initialize theme from localStorage
    useEffect(() => {
        const stored =
            typeof window !== "undefined"
                ? (localStorage.getItem("theme") as Theme | null)
                : null;
        const initial: Theme = stored === "dark" ? "dark" : "light";
        setTheme(initial);

        // Listen for theme changes from other components
        const handleThemeChange = (e: Event) => {
            const customEvent = e as CustomEvent<{ theme: Theme }>;
            setTheme(customEvent.detail.theme);
        };
        window.addEventListener("theme-change", handleThemeChange);
        return () =>
            window.removeEventListener("theme-change", handleThemeChange);
    }, []);

    const toggleTheme = () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        applyTheme(next);
    };

    const BASE_ITEMS: Item[] = [
        { label: "Home", href: "/", shortcut: "H" },
        { label: "Work", href: "/work", shortcut: "W" },
        { label: "Blog", href: "/blog", shortcut: "B" },
        { label: "Notes", href: "/notes", shortcut: "N" },
        { label: "About", href: "/about", shortcut: "A" },
        { label: "Contact", href: "/contact", shortcut: "C" },
        { label: "Projects", href: "/projects", shortcut: "P" },
        { label: "Gear", href: "/gear", shortcut: "E" },
        { label: "Tweets", href: "/tweets", shortcut: "T" },
        { label: "Now", href: "/now", shortcut: "O" },
        {
            label: "Helios",
            href: "/work/helios",
            meta: "Work",
        },
        {
            label: "Aura Analyst",
            href: "/work/aura-analyst",
            meta: "Work",
        },
        {
            label: "Steno (Mac)",
            href: "https://apps.apple.com/in/app/steno-dictation/id6762076728?mt=12",
            external: true,
            meta: "Projects",
        },
        {
            label: "Varta",
            href: "https://varta.work",
            external: true,
            meta: "Projects",
        },
        {
            label: "Sunchay",
            href: "https://x.com/SunchayApp",
            external: true,
            meta: "Projects",
        },
        {
            label: "RSS",
            href: "/feed.xml",
            meta: "Follow",
        },
        {
            label: "Substack",
            href: "https://panchamk.substack.com",
            external: true,
            meta: "Follow",
        },
        {
            label: "X / Twitter",
            href: "https://x.com/PanchamKhaitan",
            external: true,
        },
        {
            label: "Instagram",
            href: "https://www.instagram.com/pancham.khaitan/",
            external: true,
        },
        {
            label: "GitHub",
            href: "https://github.com/Pancham97",
            external: true,
        },
    ];

    const ACTION_ITEMS: Item[] = [
        {
            label:
                theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme",
            action: toggleTheme,
            meta: "Action",
        },
    ];

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                togglePalette();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [togglePalette]);

    useEffect(() => {
        const onExternalOpen = () => openPalette();
        window.addEventListener("command-palette:open", onExternalOpen);
        return () =>
            window.removeEventListener("command-palette:open", onExternalOpen);
    }, [openPalette]);

    useEffect(() => {
        if (!open) {
            setQ("");
            setCursor(0);
            return;
        }

        previouslyFocusedRef.current =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const focusTimer = window.setTimeout(
            () => inputRef.current?.focus(),
            0,
        );

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closePalette();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const focusable = getFocusableElements(dialogRef.current);
            if (focusable.length === 0) {
                event.preventDefault();
                inputRef.current?.focus();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;

            if (!dialogRef.current?.contains(active)) {
                event.preventDefault();
                first.focus();
                return;
            }

            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.clearTimeout(focusTimer);
            document.removeEventListener("keydown", onKeyDown);

            const previouslyFocused = previouslyFocusedRef.current;
            if (previouslyFocused?.isConnected) {
                previouslyFocused.focus();
            }
        };
    }, [open, closePalette]);

    const [results, setResults] = useState<Item[]>([]);

    useEffect(() => {
        const term = q.trim();
        if (!term) {
            setResults([]);
            return;
        }

        const ac = new AbortController();
        const id = setTimeout(async () => {
            try {
                const res = await fetch(
                    `/api/search?q=${encodeURIComponent(term)}`,
                    { signal: ac.signal },
                );
                if (!res.ok) {
                    return;
                }
                const data = await res.json();
                setResults(data.items || []);
            } catch {
                /* ignore */
            }
        }, 150);

        return () => {
            ac.abort();
            clearTimeout(id);
        };
    }, [q]);

    const term = q.trim().toLowerCase();
    const filteredBase = term
        ? BASE_ITEMS.filter((i) => i.label.toLowerCase().includes(term))
        : BASE_ITEMS;
    const filteredActions = term
        ? ACTION_ITEMS.filter((i) => i.label.toLowerCase().includes(term))
        : ACTION_ITEMS;

    const allFilteredItems: Item[] = term
        ? [...filteredBase, ...filteredActions, ...results]
        : [...BASE_ITEMS, ...ACTION_ITEMS];

    const grouped: Record<string, Item[]> = term
        ? {}
        : { Navigate: BASE_ITEMS, Actions: ACTION_ITEMS };
    if (term) {
        for (const item of allFilteredItems) {
            const key = item.meta || "Other";
            (grouped[key] ||= []).push(item);
        }
    }
    const groupOrder = term
        ? [
            "Navigate",
            "Action",
            "Work",
            "Blog",
            "Substack",
            "Notes",
            "Log",
            "Other",
        ]
        : ["Navigate", "Actions"];

    // Rebuild items in the same order as they appear in the grouped display
    const itemsToShow: Item[] = groupOrder
        .filter((g) => grouped[g] && grouped[g].length > 0)
        .flatMap((g) => grouped[g]);

    useEffect(() => {
        setCursor(0);
    }, [q]);

    // Scroll selected item into view
    useEffect(() => {
        if (!listRef.current || itemsToShow.length === 0) {
            return;
        }

        const prevCursor = prevCursorRef.current;
        const isWrappingToFirst =
            prevCursor === itemsToShow.length - 1 && cursor === 0;
        const isWrappingToLast =
            prevCursor === 0 && cursor === itemsToShow.length - 1;

        if (isWrappingToFirst) {
            // Scroll to absolute top
            listRef.current.scrollTo({ top: 0, behavior: "smooth" });
        } else if (isWrappingToLast) {
            // Scroll to absolute bottom
            listRef.current.scrollTo({
                top: listRef.current.scrollHeight,
                behavior: "smooth",
            });
        } else {
            // Normal scroll into view
            const activeButton = listRef.current.querySelector(
                `[data-index="${cursor}"]`,
            );
            if (activeButton) {
                activeButton.scrollIntoView({
                    block: "nearest",
                    behavior: "smooth",
                });
            }
        }

        prevCursorRef.current = cursor;
    }, [cursor, itemsToShow.length]);

    // Update scroll shadows
    useEffect(() => {
        const updateScrollShadows = () => {
            if (!listRef.current) {
                return;
            }
            const { scrollTop, scrollHeight, clientHeight } = listRef.current;
            setShowTopShadow(scrollTop > 0);
            setShowBottomShadow(scrollTop + clientHeight < scrollHeight - 1);
        };

        const list = listRef.current;
        if (!list) {
            return;
        }

        updateScrollShadows();
        list.addEventListener("scroll", updateScrollShadows);
        return () => list.removeEventListener("scroll", updateScrollShadows);
    }, [itemsToShow]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!itemsToShow.length) {
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setCursor((c) => (c + 1) % itemsToShow.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setCursor((c) => (c - 1 + itemsToShow.length) % itemsToShow.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            onSelect(itemsToShow[cursor]);
        }
    };

    const onSelect = (item: Item) => {
        setOpen(false);
        if (item.action) {
            item.action();
        } else if (item.href) {
            if (item.external) {
                window.open(item.href, "_blank", "noopener,noreferrer");
            } else {
                router.push(item.href);
            }
        }
    };

    if (!open) {
        return null;
    }

    return (
        <div
            className="cmdk-backdrop"
            onClick={closePalette}
            onKeyDown={(e) => {
                if (e.key === "Escape") {
                    closePalette();
                }
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="command-palette-title"
                className="cmdk-panel"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="command-palette-title" className="sr-only">
                    Command palette
                </h2>
                <div className="cmdk-input-row">
                    <Search
                        className="w-4 h-4"
                        strokeWidth={1.5}
                        aria-hidden="true"
                    />
                    <input
                        ref={inputRef}
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Search pages, posts, or a command…"
                        className="cmdk-input"
                        role="combobox"
                        aria-label="Search site content and commands"
                        aria-expanded="true"
                        aria-controls="command-palette-list"
                        aria-activedescendant={
                            itemsToShow.length > 0
                                ? `command-item-${cursor}`
                                : undefined
                        }
                        aria-autocomplete="list"
                    />
                </div>

                <div className="relative">
                    {showTopShadow && (
                        <div className="cmdk-scroll-fade-top" aria-hidden />
                    )}

                    <div
                        ref={listRef}
                        id="command-palette-list"
                        role="listbox"
                        className="cmdk-list"
                    >
                        {groupOrder
                            .filter((g) => grouped[g] && grouped[g].length)
                            .map((group) => (
                                <div key={group}>
                                    <div className="cmdk-group-label">
                                        {group}
                                    </div>
                                    <ul>
                                        {grouped[group].map((item, idx) => {
                                            const beforeCount = groupOrder
                                                .slice(
                                                    0,
                                                    groupOrder.indexOf(group),
                                                )
                                                .reduce(
                                                    (sum, g) =>
                                                        sum +
                                                        (grouped[g]?.length ||
                                                            0),
                                                    0,
                                                );
                                            const absIdx = beforeCount + idx;
                                            const isActive = absIdx === cursor;
                                            return (
                                                <CommandPaletteItem
                                                    key={
                                                        item.href || item.label
                                                    }
                                                    item={item}
                                                    isActive={isActive}
                                                    absIdx={absIdx}
                                                    onSelect={onSelect}
                                                    onActive={setCursor}
                                                    theme={theme}
                                                />
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        {itemsToShow.length === 0 && (
                            <div className="cmdk-empty">No results found</div>
                        )}
                    </div>

                    {showBottomShadow && (
                        <div className="cmdk-scroll-fade-bottom" aria-hidden />
                    )}
                </div>
                <div className="cmdk-footer">
                    <div className="cmdk-footer-hints">
                        <span className="cmdk-hint">
                            <kbd className="cmdk-kbd">↵</kbd>
                            <span>open</span>
                        </span>
                        <span className="cmdk-hint">
                            <kbd className="cmdk-kbd">↑</kbd>
                            <kbd className="cmdk-kbd">↓</kbd>
                            <span>move</span>
                        </span>
                    </div>
                    <span className="cmdk-hint">
                        <kbd className="cmdk-kbd">esc</kbd>
                        <span>close</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
