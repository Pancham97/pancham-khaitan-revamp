"use client";

import {
    useState,
    useEffect,
    useRef,
    type KeyboardEvent as ReactKeyboardEvent,
    type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface ImageZoomProps {
    src: string;
    alt: string;
    sizes?: string;
    priority?: boolean;
    zoomable?: boolean;
}

const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusableElements(container: HTMLElement | null) {
    if (!container) {
        return [];
    }

    return Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((node) => node.getClientRects().length > 0);
}

export default function ImageZoom({
    src,
    alt,
    sizes = "(min-width: 768px) 720px, calc(100vw - 2rem)",
    priority = false,
    zoomable = true,
}: ImageZoomProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const triggerRef = useRef<HTMLSpanElement | null>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);
    const shouldBypassOptimization =
        /\.gif(?:$|[?#])/i.test(src) ||
        src.startsWith("blob:") ||
        src.startsWith("data:");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const triggerElement = triggerRef.current;
        const previouslyFocused =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : triggerElement;
        const focusTimer = window.setTimeout(() => {
            closeButtonRef.current?.focus();
        }, 0);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                setIsOpen(false);
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const focusable = getFocusableElements(dialogRef.current);
            if (focusable.length === 0) {
                event.preventDefault();
                dialogRef.current?.focus();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;

            if (!dialogRef.current?.contains(active)) {
                event.preventDefault();
                first.focus();
                return;
            }

            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            window.clearTimeout(focusTimer);
            document.removeEventListener("keydown", handleKeyDown);

            if (previouslyFocused?.isConnected) {
                previouslyFocused.focus();
            } else {
                triggerElement?.focus();
            }
        };
    }, [isOpen]);

    const openImage = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsOpen(true);
    };

    const openImageFromClick = (event: MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsOpen(true);
    };

    return (
        <>
            {/* Thumbnail */}
            <span
                ref={triggerRef}
                className="markdown-image-container"
                role={zoomable ? "button" : undefined}
                tabIndex={zoomable ? 0 : undefined}
                aria-label={
                    zoomable
                        ? alt
                            ? `Zoom image: ${alt}`
                            : "Zoom image"
                        : undefined
                }
                onClick={zoomable ? openImageFromClick : undefined}
                onKeyDown={(event) => {
                    if (
                        zoomable &&
                        (event.key === "Enter" || event.key === " ")
                    ) {
                        openImage(event);
                    }
                }}
            >
                <Image
                    src={src}
                    alt={alt}
                    className="markdown-image"
                    width={1200}
                    height={800}
                    sizes={sizes}
                    priority={priority}
                    unoptimized={shouldBypassOptimization}
                    style={zoomable ? undefined : { cursor: "pointer" }}
                />
            </span>

            {/* Lightbox Modal - Rendered via Portal to avoid nesting issues */}
            {zoomable &&
                mounted &&
                isOpen &&
                createPortal(
                    <div
                        ref={dialogRef}
                        className="image-lightbox"
                        onClick={() => setIsOpen(false)}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Image zoom dialog"
                        tabIndex={-1}
                    >
                        <div className="image-lightbox-content">
                            <button
                                ref={closeButtonRef}
                                onClick={() => setIsOpen(false)}
                                className="image-lightbox-close"
                                aria-label="Close image zoom"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                            <Image
                                src={src}
                                alt={alt}
                                width={1920}
                                height={1080}
                                className="image-lightbox-img"
                                onClick={(e) => e.stopPropagation()}
                                sizes="90vw"
                                unoptimized={shouldBypassOptimization}
                                style={{
                                    width: "auto",
                                    height: "auto",
                                    maxWidth: "90vw",
                                    maxHeight: "90vh",
                                }}
                            />
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}
