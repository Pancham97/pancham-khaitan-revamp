"use client";

export default function SearchTrigger() {
    return (
        <button
            type="button"
            className="search-trigger"
            aria-label="Open search"
            onClick={() => {
                window.dispatchEvent(new Event("command-palette:open"));
            }}
        >
            Search
        </button>
    );
}
