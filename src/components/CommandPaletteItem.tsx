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
    const cls = "inline-block w-3.5 h-3.5";
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
            className={isActive ? "cmdk-item is-active" : "cmdk-item"}
        >
            <span className="cmdk-item__label">
                <Icon meta={item.meta} theme={theme} />
                <span className="cmdk-item__text">
                    <span className="cmdk-item__name">{item.label}</span>
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
                <kbd className="cmdk-kbd">{item.shortcut}</kbd>
            )}
        </li>
    );
}
