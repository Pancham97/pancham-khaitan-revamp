"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NAV } from "@/data/site";

type ShortcutConfig = {
    key: string;
    label: string;
    path: string;
};

const NAVIGATION_SHORTCUTS: ShortcutConfig[] = NAV.map((item) => ({
    key: item.key,
    label: item.label,
    path: item.href,
}));

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
                const shortcut = singleKeyMap.get(key);
                if (shortcut) {
                    event.preventDefault();
                    router.push(shortcut.path);
                }
                awaitingLeader.current = false;
                clearLeaderTimer();
                return;
            }

            if (key === LEADER_KEY) {
                event.preventDefault();
                awaitingLeader.current = true;
                clearLeaderTimer();
                resetTimer.current = window.setTimeout(() => {
                    awaitingLeader.current = false;
                    resetTimer.current = null;
                }, 1000);
                return;
            }

            const shortcut = singleKeyMap.get(key);
            if (shortcut) {
                event.preventDefault();
                router.push(shortcut.path);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            clearLeaderTimer();
        };
    }, [clearLeaderTimer, router, singleKeyMap]);

    const hideHelp = useCallback(() => setHelpVisible(false), []);

    return {
        isHelpVisible,
        setHelpVisible,
        hideHelp,
        shortcuts: NAVIGATION_SHORTCUTS,
        leaderKey: LEADER_KEY,
    };
}
