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
    return (
        <span className="flex items-center gap-1.5">
            <span
                className={`
                  text-[10px] uppercase tracking-wider font-semibold
                  ${
        active
            ? `
              text-neutral-300
              dark:text-white/60
            `
            : `
              text-neutral-500
              dark:text-neutral-400
            `
        }
                `}
            >
                {meta}
            </span>
            {external && (
                <MoveUpRight
                    className={`
                      w-2.5 h-2.5
                      ${
                active
                    ? `
                      text-neutral-300
                      dark:text-white/60
                    `
                    : `
                      text-neutral-500
                      dark:text-neutral-400
                    `
                }
                    `}
                    strokeWidth={1.5}
                    aria-label="Opens in new tab"
                />
            )}
        </span>
    );
}
