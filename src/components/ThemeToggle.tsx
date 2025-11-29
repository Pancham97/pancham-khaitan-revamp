"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

declare global {
    interface Window {
        __setTheme?: (value: Theme) => void;
    }
}

function applyTheme(theme: Theme) {
    if (
        typeof window !== "undefined" &&
        typeof window.__setTheme === "function"
    ) {
        window.__setTheme(theme);
        return;
    }
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

    // Broadcast theme change to all listeners
    window.dispatchEvent(
        new CustomEvent("theme-change", { detail: { theme } }),
    );
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>("light");

    // Initialize from localStorage; default to light
    useEffect(() => {
        const stored =
            typeof window !== "undefined"
                ? (localStorage.getItem("theme") as Theme | null)
                : null;
        const initial: Theme = stored === "dark" ? "dark" : "light";
        setTheme(initial);
        applyTheme(initial);
        try {
            localStorage.setItem("theme", initial);
        } catch {}

        // Listen for theme changes from other components
        const handleThemeChange = (e: Event) => {
            const customEvent = e as CustomEvent<{ theme: Theme }>;
            setTheme(customEvent.detail.theme);
        };
        window.addEventListener("theme-change", handleThemeChange);
        return () =>
            window.removeEventListener("theme-change", handleThemeChange);
    }, []);

    const toggle = () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        applyTheme(next);
        try {
            localStorage.setItem("theme", next);
        } catch {}
    };

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={isDark}
            aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            className={`
              rounded p-1.5
              hover:bg-neutral-100
              dark:hover:bg-white/10
              transition-colors
            `}
        >
            {isDark ? (
                <Sun className="w-4 h-4" strokeWidth={1.5} />
            ) : (
                <Moon className="w-4 h-4" strokeWidth={1.5} />
            )}
        </button>
    );
}
