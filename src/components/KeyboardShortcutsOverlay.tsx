"use client";

import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

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

export default function KeyboardShortcutsOverlay() {
    const { isHelpVisible, hideHelp, shortcuts } = useKeyboardShortcuts();
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isHelpVisible) {
            return;
        }

        previouslyFocusedRef.current =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;

        const focusTimer = window.setTimeout(() => {
            closeButtonRef.current?.focus();
        }, 0);

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                hideHelp();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const focusable = getFocusableElements(dialogRef.current);
            if (focusable.length === 0) {
                event.preventDefault();
                closeButtonRef.current?.focus();
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
            window.clearTimeout(focusTimer);
            document.removeEventListener("keydown", onKeyDown);

            const previouslyFocused = previouslyFocusedRef.current;
            if (previouslyFocused?.isConnected) {
                previouslyFocused.focus();
            }
        };
    }, [hideHelp, isHelpVisible]);

    if (!isHelpVisible) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
            onClick={hideHelp}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="keyboard-shortcuts-title"
                className={`
                  mx-auto mt-24 max-w-md rounded border border-neutral-200
                  bg-white p-4 shadow-xl
                  dark:border-neutral-800 dark:bg-black
                `}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-2 flex items-center justify-between gap-3">
                    <div
                        id="keyboard-shortcuts-title"
                        className={`
                          text-sm font-medium text-neutral-600
                          dark:text-neutral-300
                        `}
                    >
                        Keyboard shortcuts
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        aria-label="Close keyboard shortcuts"
                        onClick={hideHelp}
                        className={`
                          inline-flex h-9 w-9 items-center justify-center
                          rounded-md
                          hover:bg-neutral-100
                          dark:hover:bg-white/10
                        `}
                    >
                        <X
                            className="h-4 w-4"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />
                    </button>
                </div>
                <div className="space-y-4 text-sm">
                    <div>
                        <div
                            className={`
                              mb-1 text-sm uppercase tracking-wide
                              text-neutral-500
                              dark:text-neutral-400
                            `}
                        >
                            Leader key navigation
                        </div>
                        <ul
                            className={`
                              grid grid-cols-1 gap-y-2
                              sm:grid-cols-2
                            `}
                        >
                            {shortcuts.map((shortcut) => (
                                <li key={`combo-${shortcut.key}`}>
                                    <kbd className="kbd">g</kbd> then{" "}
                                    <kbd className="kbd">{shortcut.key}</kbd>{" "}
                                    {shortcut.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div
                            className={`
                              mb-1 text-sm uppercase tracking-wide
                              text-neutral-500
                              dark:text-neutral-400
                            `}
                        >
                            Single key navigation
                        </div>
                        <ul
                            className={`
                              grid grid-cols-1 gap-y-2
                              sm:grid-cols-2
                            `}
                        >
                            {shortcuts.map((shortcut) => (
                                <li key={`single-${shortcut.key}`}>
                                    <kbd className="kbd">{shortcut.key}</kbd>{" "}
                                    {shortcut.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div
                    className={`
                      mt-4 text-sm text-neutral-500
                      dark:text-neutral-400
                    `}
                >
                    Press ? to toggle this panel, Esc to close
                </div>
            </div>
        </div>
    );
}
