import { MoveUpRight } from "lucide-react";

interface CommandPaletteMetaProps {
    meta: string;
    external?: boolean;
    active: boolean;
}

export default function CommandPaletteMeta({
    meta,
    external,
}: CommandPaletteMetaProps) {
    return (
        <span className="cmdk-item__meta flex items-center gap-1.5">
            <span>{meta}</span>
            {external && (
                <MoveUpRight
                    className="h-2.5 w-2.5"
                    strokeWidth={1.5}
                    aria-hidden="true"
                />
            )}
        </span>
    );
}
