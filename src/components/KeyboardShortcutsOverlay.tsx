"use client";

import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function KeyboardShortcutsOverlay() {
    const { isHelpVisible, hideHelp, shortcuts } = useKeyboardShortcuts();

    if (!isHelpVisible) {
        return null;
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={hideHelp}
        >
            <div
                className={`
                  mx-auto mt-24 max-w-md rounded border border-neutral-200
                  bg-white p-4 shadow-xl
                  dark:border-neutral-800 dark:bg-black
                `}
                onClick={(event) => event.stopPropagation()}
            >
                <div
                    className={`
                      mb-2 text-sm font-medium text-neutral-600
                      dark:text-neutral-300
                    `}
                >
                    Keyboard shortcuts
                </div>
                <div className="space-y-4 text-sm">
                    <div>
                        <div
                            className={`
                              mb-1 text-xs uppercase tracking-wide
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
                              mb-1 text-xs uppercase tracking-wide
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
                      mt-4 text-xs text-neutral-500
                      dark:text-neutral-400
                    `}
                >
                    Press ? to toggle this panel, Esc to close
                </div>
            </div>
        </div>
    );
}
