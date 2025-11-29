type GeistFontModule = {
    Geist?: { className?: string };
    Geist_Mono?: { variable?: string };
};

declare const require: NodeJS.Require;

export function getFontClasses(): string {
    try {
        // Optional dependency: only works if `geist` is installed
        const { Geist, Geist_Mono } = require("geist/font") as GeistFontModule;
        const body = Geist?.className ?? "";
        const monoVar = Geist_Mono?.variable ?? "";
        return `${body} ${monoVar}`.trim();
    } catch {
        return "";
    }
}
