"use client";

import dynamic from "next/dynamic";
import KeyboardShortcutsOverlay from "./KeyboardShortcutsOverlay";

const CommandPalette = dynamic(() => import("./CommandPalette"), {
    ssr: false,
});

export default function ClientOverlays() {
    return (
        <>
            <KeyboardShortcutsOverlay />
            <CommandPalette />
        </>
    );
}
