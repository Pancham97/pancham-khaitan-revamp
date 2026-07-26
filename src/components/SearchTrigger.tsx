"use client";

import { useEffect, useState } from "react";

function isApplePlatform() {
    if (typeof navigator === "undefined") {
        return false;
    }
    return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
}

export default function SearchTrigger() {
    const [modKey, setModKey] = useState("Ctrl");

    useEffect(() => {
        setModKey(isApplePlatform() ? "⌘" : "Ctrl");
    }, []);

    return (
        <button
            type="button"
            className="search-trigger"
            aria-label="Open search (Command or Control K)"
            onClick={() => {
                window.dispatchEvent(new Event("command-palette:open"));
            }}
        >
            <span>Search</span>
            <kbd className="site-kbd" aria-hidden>
                {modKey}
                {modKey === "⌘" ? "K" : "+K"}
            </kbd>
        </button>
    );
}
