"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ShortcutConfig = {
    key: string;
    label: string;
    path: string;
};

const NAVIGATION_SHORTCUTS: ShortcutConfig[] = [
    { key: "h", label: "Home", path: "/" },
    { key: "w", label: "Work", path: "/work" },
    { key: "b", label: "Blog", path: "/blog" },
    { key: "u", label: "Updates", path: "/updates" },
    { key: "n", label: "Notes", path: "/notes" },
    { key: "a", label: "About", path: "/about" },
    { key: "c", label: "Contact", path: "/contact" },
];

const LEADER_KEY = "g";

function shouldIgnoreTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
        return false;
    }
    const tag = target.tagName.toLowerCase();
    return (
        target.isContentEditable ||
        tag === "input" ||
        tag === "textarea" ||
        tag === "select"
    );
}

export function useKeyboardShortcuts() {
    const router = useRouter();
    const [isHelpVisible, setHelpVisible] = useState(false);
    const awaitingLeader = useRef(false);
    const resetTimer = useRef<number | null>(null);

    const singleKeyMap = useMemo(() => {
        const map = new Map<string, ShortcutConfig>();
        NAVIGATION_SHORTCUTS.forEach((shortcut) => {
            map.set(shortcut.key, shortcut);
        });
        return map;
    }, []);

    const clearLeaderTimer = useCallback(() => {
        if (resetTimer.current) {
            window.clearTimeout(resetTimer.current);
            resetTimer.current = null;
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.metaKey || event.ctrlKey || event.altKey) {
                return;
            }
            if (shouldIgnoreTarget(event.target)) {
                return;
            }

            const key =
                event.key.length === 1 ? event.key.toLowerCase() : event.key;

            if (key === "?") {
                event.preventDefault();
                setHelpVisible((visible) => !visible);
                return;
            }

            if (key === "Escape") {
                setHelpVisible(false);
                awaitingLeader.current = false;
                clearLeaderTimer();
                return;
            }

            if (awaitingLeader.current) {
                awaitingLeader.current = false;
                clearLeaderTimer();
                const shortcut = singleKeyMap.get(key);
                if (shortcut) {
                    event.preventDefault();
                    router.push(shortcut.path);
                }
                return;
            }

            if (key === LEADER_KEY) {
                awaitingLeader.current = true;
                clearLeaderTimer();
                resetTimer.current = window.setTimeout(() => {
                    awaitingLeader.current = false;
                }, 1200);
                return;
            }

            const singleShortcut = singleKeyMap.get(key);
            if (singleShortcut) {
                event.preventDefault();
                router.push(singleShortcut.path);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            clearLeaderTimer();
        };
    }, [router, singleKeyMap, clearLeaderTimer]);

    const showHelp = useCallback(() => setHelpVisible(true), []);
    const hideHelp = useCallback(() => setHelpVisible(false), []);
    const toggleHelp = useCallback(
        () => setHelpVisible((visible) => !visible),
        [],
    );

    return {
        isHelpVisible,
        showHelp,
        hideHelp,
        toggleHelp,
        shortcuts: NAVIGATION_SHORTCUTS,
    };
}
