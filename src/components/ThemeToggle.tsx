"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

declare global {
    interface Window {
        __setTheme?: (value: Theme) => void;
    }
}

function getTheme(): Theme {
    if (typeof document === "undefined") {
        return "light";
    }
    return document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
}

function subscribe(onStoreChange: () => void) {
    window.addEventListener("theme-change", onStoreChange);
    return () => window.removeEventListener("theme-change", onStoreChange);
}

function applyTheme(theme: Theme) {
    if (typeof window.__setTheme === "function") {
        window.__setTheme(theme);
    } else {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        root.setAttribute("data-theme", theme);
        root.style.colorScheme = theme;
        const meta = document.querySelector('meta[name="color-scheme"]');
        if (meta) {
            meta.setAttribute("content", theme);
        }
        try {
            localStorage.setItem("theme", theme);
        } catch {
            /* ignore */
        }
    }
    window.dispatchEvent(
        new CustomEvent("theme-change", { detail: { theme } }),
    );
}

export default function ThemeToggle() {
    const theme = useSyncExternalStore(subscribe, getTheme, () => "light");
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            className="theme-toggle"
            aria-pressed={isDark}
            aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            onClick={() => applyTheme(isDark ? "light" : "dark")}
        >
            {isDark ? "Light" : "Dark"}
        </button>
    );
}
