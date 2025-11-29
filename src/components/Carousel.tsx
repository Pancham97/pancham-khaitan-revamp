"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarouselContentItem } from "@/types";

interface CarouselProps {
    items: CarouselContentItem[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const transitionRef = useRef(false);

    const handlePrevious = useCallback(() => {
        if (transitionRef.current) {
            return;
        }
        transitionRef.current = true;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) =>
                prev === 0 ? items.length - 1 : prev - 1,
            );
            setIsTransitioning(false);
            transitionRef.current = false;
        }, 50);
    }, [items.length]);

    const handleNext = useCallback(() => {
        if (transitionRef.current) {
            return;
        }
        transitionRef.current = true;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) =>
                prev === items.length - 1 ? 0 : prev + 1,
            );
            setIsTransitioning(false);
            transitionRef.current = false;
        }, 50);
    }, [items.length]);

    // Auto-play functionality
    useEffect(() => {
        if (items.length > 1) {
            intervalRef.current = setInterval(() => {
                handleNext();
            }, 6000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [handleNext, items.length]);

    if (!items || items.length === 0) {
        return null;
    }

    const currentItem = items[currentIndex];

    return (
        <div
            className={`
              relative w-full h-[600px] overflow-hidden bg-phantom-black
            `}
        >
            {/* Background with gradient overlay */}
            <div className="absolute inset-0">
                <div
                    className={`
                      absolute inset-0 bg-gradient-to-br from-phantom-black
                      via-gray-900 to-neutral-700/30
                    `}
                />
            </div>

            {/* Content */}
            <div className="relative h-full container mx-auto px-4">
                <div className="h-full flex items-center">
                    <div
                        className={`
                          grid grid-cols-1
                          lg:grid-cols-2
                          gap-8
                          lg:gap-12
                          items-center w-full
                        `}
                    >
                        {/* Text Content */}
                        <div
                            className={`
                              text-white space-y-6 transition-all duration-700
                              ${
        isTransitioning
            ? "opacity-0 translate-y-4"
            : "opacity-100 translate-y-0"
        }
                            `}
                        >
                            <h2
                                className={`
                                  text-4xl
                                  lg:text-6xl
                                  font-bold leading-tight
                                `}
                            >
                                {currentItem.title}
                            </h2>

                            <p
                                className={`
                                  text-lg
                                  lg:text-xl
                                  text-gray-300 leading-relaxed max-w-xl
                                `}
                            >
                                {currentItem.shortDescription}
                            </p>

                            <div className="pt-4">
                                <Link
                                    href={`/${currentItem.slug}`}
                                    className="inline-flex items-center group"
                                >
                                    <span
                                        className={`
                                          px-8 py-4 bg-white text-black
                                          font-medium transform transition-all
                                          duration-300
                                          group-hover:translate-x-1
                                          group-hover:bg-white/80
                                        `}
                                    >
                                        {currentItem.buttonText || "Explore"}
                                    </span>
                                    <span
                                        className={`
                                          w-12 h-[52px] bg-white/80 flex
                                          items-center justify-center transform
                                          transition-all duration-300
                                          group-hover:translate-x-2
                                          group-hover:bg-white
                                        `}
                                    >
                                        <ChevronRight
                                            className="w-5 h-5 text-black"
                                            strokeWidth={1.5}
                                        />
                                    </span>
                                </Link>
                            </div>
                        </div>

                        {/* Image */}
                        <div
                            className={`
                              relative h-[400px]
                              lg:h-[450px]
                              transition-all duration-700
                              ${
        isTransitioning
            ? "opacity-0 scale-95"
            : "opacity-100 scale-100"
        }
                            `}
                        >
                            <div
                                className={`
                                  relative h-full w-full overflow-hidden
                                  bg-gray-800
                                `}
                            >
                                <Image
                                    src={currentItem.heroImage}
                                    alt={currentItem.heroImageAlt}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                {/* Decorative frame */}
                                <div
                                    className={`
                                      absolute inset-0 border-2 border-white/20
                                      transform translate-x-4 translate-y-4
                                      -z-10
                                    `}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            {items.length > 1 && (
                <>
                    <button
                        onClick={handlePrevious}
                        className={`
                          absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12
                          flex items-center justify-center bg-white/10
                          backdrop-blur-sm
                          hover:bg-white/20
                          transition-all duration-300 group
                        `}
                        aria-label="Previous"
                    >
                        <ChevronLeft
                            className={`
                              w-6 h-6 text-white
                              group-hover:-translate-x-1
                              transition-transform
                            `}
                            strokeWidth={1.5}
                        />
                    </button>

                    <button
                        onClick={handleNext}
                        className={`
                          absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12
                          flex items-center justify-center bg-white/10
                          backdrop-blur-sm
                          hover:bg-white/20
                          transition-all duration-300 group
                        `}
                        aria-label="Next"
                    >
                        <ChevronRight
                            className={`
                              w-6 h-6 text-white
                              group-hover:translate-x-1
                              transition-transform
                            `}
                            strokeWidth={1.5}
                        />
                    </button>

                    {/* Dots with progress */}
                    <div
                        className={`
                          absolute bottom-8 left-1/2 -translate-x-1/2 flex
                          items-center gap-3
                        `}
                    >
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className="relative group"
                                aria-label={`Go to slide ${index + 1}`}
                            >
                                <div
                                    className={`
                                      w-12 h-1 bg-white/20 overflow-hidden
                                      transition-all duration-300
                                      ${
                            index === currentIndex
                                ? "w-16"
                                : "hover:w-14"
                            }
                                    `}
                                >
                                    {index === currentIndex && (
                                        <div
                                            className={`
                                              h-full bg-white animate-progress
                                            `}
                                            style={{ animationDuration: "6s" }}
                                        />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Carousel;
