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
    onActive: (index: number) => void;
    theme: Theme;
}

export default function CommandPaletteItem({
    item,
    isActive,
    absIdx,
    onSelect,
    onActive,
    theme,
}: CommandPaletteItemProps) {
    const activeButtonClassName =
        "bg-neutral-900 text-white shadow-sm dark:bg-white/15 dark:text-white dark:shadow-[0_0_0_1px_rgba(255,255,255,0.15)]";
    const inactiveButtonClassName =
        "text-neutral-700 hover:bg-neutral-100/80 dark:text-neutral-200 dark:hover:bg-white/10";
    const activeLabelClassName = "text-white dark:text-white";
    const inactiveLabelClassName =
        "text-neutral-600 group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-white";
    const activeShortcutClassName =
        "border-white/70 bg-white/10 text-white dark:border-black/40 dark:bg-black/40 dark:text-white";
    const inactiveShortcutClassName =
        "border-neutral-300 bg-neutral-50 text-neutral-700 dark:border-white/15 dark:bg-white/5 dark:text-neutral-200";
    const buttonClassName = [
        "group flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg",
        "px-4 py-2.5 text-left text-sm",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-offset-2 focus-visible:ring-black/40",
        "focus-visible:ring-offset-transparent",
        "transition-none!",
        "dark:focus-visible:ring-white/35",
        isActive ? activeButtonClassName : inactiveButtonClassName,
    ].join(" ");
    const labelClassName = [
        "inline-flex min-w-0 items-center gap-2",
        isActive ? activeLabelClassName : inactiveLabelClassName,
    ].join(" ");
    const shortcutClassName = [
        "rounded border px-2 py-1 font-mono text-xs",
        isActive ? activeShortcutClassName : inactiveShortcutClassName,
    ].join(" ");
    const ariaLabel = `${item.label}${item.meta ? ` - ${item.meta}` : ""}${
        item.external ? " - opens in new tab" : ""
    }`;

    return (
        <li
            id={`command-item-${absIdx}`}
            key={item.href || item.label}
            data-index={absIdx}
            role="option"
            aria-selected={isActive}
            aria-label={ariaLabel}
            onMouseDown={(event) => event.preventDefault()}
            onMouseMove={() => onActive(absIdx)}
            onClick={() => onSelect(item)}
            className={buttonClassName}
        >
            <span className={labelClassName}>
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
                <kbd className={shortcutClassName}>{item.shortcut}</kbd>
            )}
        </li>
    );
}
