import { MoveUpRight } from "lucide-react";

interface CommandPaletteMetaProps {
    meta: string;
    external?: boolean;
    active: boolean;
}

export default function CommandPaletteMeta({
    meta,
    external,
    active,
}: CommandPaletteMetaProps) {
    const metaClassName = [
        "text-xs font-semibold uppercase tracking-wider",
        active
            ? "text-neutral-300 dark:text-white/60"
            : "text-neutral-500 dark:text-neutral-400",
    ].join(" ");
    const iconClassName = [
        "h-2.5 w-2.5",
        active
            ? "text-neutral-300 dark:text-white/60"
            : "text-neutral-500 dark:text-neutral-400",
    ].join(" ");

    return (
        <span className="flex items-center gap-1.5">
            <span className={metaClassName}>{meta}</span>
            {external && (
                <MoveUpRight
                    className={iconClassName}
                    strokeWidth={1.5}
                    aria-hidden="true"
                />
            )}
        </span>
    );
}
