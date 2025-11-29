"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface ImageZoomProps {
    src: string;
    alt: string;
}

export default function ImageZoom({ src, alt }: ImageZoomProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    setIsOpen(false);
                }
            };
            document.addEventListener("keydown", handleEscape);
            return () => document.removeEventListener("keydown", handleEscape);
        }
    }, [isOpen]);

    return (
        <>
            {/* Thumbnail */}
            <span className="markdown-image-container">
                <Image
                    src={src}
                    alt={alt}
                    onClick={() => setIsOpen(true)}
                    className="markdown-image"
                    width={800}
                    height={600}
                    style={{ width: "auto", height: "auto", maxWidth: "100%" }}
                    unoptimized
                />
            </span>

            {/* Lightbox Modal - Rendered via Portal to avoid nesting issues */}
            {mounted &&
                isOpen &&
                createPortal(
                    <div
                        className="image-lightbox"
                        onClick={() => setIsOpen(false)}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Image zoom dialog"
                    >
                        <div className="image-lightbox-content">
                            <button
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
                                style={{
                                    width: "auto",
                                    height: "auto",
                                    maxWidth: "90vw",
                                    maxHeight: "90vh",
                                }}
                                unoptimized
                            />
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}
