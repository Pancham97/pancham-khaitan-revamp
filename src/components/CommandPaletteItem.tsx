import React from "react";
import {
    Briefcase,
    Megaphone,
    Moon,
    Newspaper,
    NotebookPen,
    Sun,
} from "lucide-react";
import CommandPaletteMeta from "./CommandPaletteMeta";

type Item = {
    label: string;
    href?: string;
    external?: boolean;
    meta?: string;
    shortcut?: string;
    action?: () => void;
};

type Theme = "light" | "dark";

interface IconProps {
    meta?: string;
    theme: Theme;
}

const Icon = ({ meta, theme }: IconProps) => {
    const cls = "inline-block w-3.5 h-3.5 mr-2 text-neutral-500";
    if (meta === "Work") {
        return (
            <Briefcase className={cls} strokeWidth={1.5} aria-hidden="true" />
        );
    }
    if (meta === "Blog") {
        return (
            <Newspaper className={cls} strokeWidth={1.5} aria-hidden="true" />
        );
    }
    if (meta === "Notes") {
        return (
            <NotebookPen className={cls} strokeWidth={1.5} aria-hidden="true" />
        );
    }
    if (meta === "Updates") {
        return (
            <Megaphone className={cls} strokeWidth={1.5} aria-hidden="true" />
        );
    }
    if (meta === "Action") {
        return theme === "dark" ? (
            <Sun className={cls} strokeWidth={1.5} aria-hidden="true" />
        ) : (
            <Moon className={cls} strokeWidth={1.5} aria-hidden="true" />
        );
    }
    return null;
};

interface CommandPaletteItemProps {
    item: Item;
    isActive: boolean;
    absIdx: number;
    onSelect: (item: Item) => void;
    theme: Theme;
}

export default function CommandPaletteItem({
    item,
    isActive,
    absIdx,
    onSelect,
    theme,
}: CommandPaletteItemProps) {
    return (
        <li
            key={item.href || item.label}
            role="option"
            aria-selected={isActive}
        >
            <button
                id={`command-item-${absIdx}`}
                data-index={absIdx}
                onClick={() => onSelect(item)}
                className={`
                  group w-full rounded-lg px-4 py-2.5 text-sm text-left flex
                  items-center justify-between gap-3
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-offset-2 focus-visible:ring-black/40
                  dark:focus-visible:ring-white/35
                  focus-visible:ring-offset-transparent
                  transition-none!
                  ${
        isActive
            ? `
              bg-neutral-900 text-white shadow-sm
              dark:bg-white/15 dark:text-black
              dark:shadow-[0_0_0_1px_rgba(255,255,255,0.15)]
            `
            : `
              text-neutral-700
              hover:bg-neutral-100/80
              dark:text-neutral-200 dark:hover:bg-white/10
            `
        }
                `}
                aria-label={`${item.label}${item.meta ? ` - ${item.meta}` : ""}`}
            >
                <span
                    className={`
                      inline-flex items-center min-w-0 gap-2
                      ${
        isActive
            ? `
              text-white
              dark:text-white
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
                    <Icon meta={item.meta} theme={theme} />
                    <span className="flex flex-col min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.meta && (
                            <CommandPaletteMeta
                                meta={item.meta}
                                external={item.external}
                                active={isActive}
                            />
                        )}
                    </span>
                </span>
                {item.shortcut && (
                    <kbd
                        className={`
                          text-[11px] px-2 py-1 rounded border font-mono
                          ${
                    isActive
                        ? `
                          border-white/70 bg-white/10 text-white
                          dark:border-black/40 dark:bg-black/40 dark:text-white
                        `
                        : `
                          border-neutral-300 bg-neutral-50 text-neutral-700
                          dark:border-white/15 dark:bg-white/5
                          dark:text-neutral-200
                        `
                    }
                        `}
                    >
                        {item.shortcut}
                    </kbd>
                )}
            </button>
        </li>
    );
}
