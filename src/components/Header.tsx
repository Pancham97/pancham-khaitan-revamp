"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const menuItems = [
    {
        title: "My Work",
        route: "/work",
    },
    {
        title: "Blog",
        route: "/blog",
    },
    {
        title: "Notes",
        route: "/notes",
    },
    {
        title: "About Me",
        route: "/about",
    },
];

const Header = () => {
    const [navExpanded, setNavExpanded] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const handleWindowScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };

    const handleDocumentClick = (e: Event) => {
        const headerEl = document.querySelector("nav");
        if (headerEl && !headerEl.contains(e.target as Node)) {
            setNavExpanded(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleWindowScroll);
        document.addEventListener("click", handleDocumentClick);

        return function cleanup() {
            window.removeEventListener("scroll", handleWindowScroll);
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    return (
        <nav
            className={`
              fixed top-0 left-0 right-0 z-50 transition-all duration-300
              h-[86px] flex items-center
              ${
        isScrolled
            ? `
              bg-white/95
              dark:bg-black/95
              backdrop-blur-md shadow-lg
              dark:shadow-gray-900
            `
            : `
              bg-white
              dark:bg-black
            `
        }
            `}
        >
            <div
                className={`
                  w-full max-w-7xl mx-auto px-4 flex items-center
                  justify-between
                `}
            >
                {/* Logo/Brand */}
                <Link
                    href="/"
                    className={`
                      text-xl
                      lg:text-2xl
                      font-bold text-black
                      dark:text-white
                      transition-colors duration-300 no-underline
                      hover:opacity-80
                    `}
                    onClick={() => setNavExpanded(false)}
                >
                    Pancham Khaitan
                </Link>

                {/* Mobile menu button */}
                <button
                    className={`
                      lg:hidden
                      flex flex-col justify-center items-center w-8 h-8
                      space-y-1.5
                    `}
                    onClick={() => setNavExpanded(!navExpanded)}
                    aria-label="Toggle navigation"
                >
                    <span
                        className={`
                          block w-6 h-0.5 bg-black
                          dark:bg-white
                          transition-all duration-300
                          ${navExpanded ? "rotate-45 translate-y-2" : ""}
                        `}
                    />
                    <span
                        className={`
                          block w-6 h-0.5 bg-black
                          dark:bg-white
                          transition-all duration-300
                          ${navExpanded ? "opacity-0" : ""}
                        `}
                    />
                    <span
                        className={`
                          block w-6 h-0.5 bg-black
                          dark:bg-white
                          transition-all duration-300
                          ${navExpanded ? "-rotate-45 -translate-y-2" : ""}
                        `}
                    />
                </button>

                {/* Desktop Navigation */}
                <div
                    className={`
                      hidden
                      lg:flex
                      items-center space-x-8
                    `}
                >
                    {menuItems.map((menuItem, key) => (
                        <Link
                            key={key}
                            href={menuItem.route}
                            className={`
                              nav-link text-lg font-medium no-underline
                            `}
                        >
                            {menuItem.title}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        className="primary-button no-underline"
                    >
                        Contact Me
                    </Link>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`
                      lg:hidden
                      absolute top-full left-0 right-0 bg-white
                      dark:bg-black
                      shadow-lg
                      dark:shadow-gray-900
                      transition-all duration-300
                      ${
        navExpanded
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }
                    `}
                >
                    <div className="flex flex-col py-4">
                        {menuItems.map((menuItem, key) => (
                            <Link
                                key={key}
                                href={menuItem.route}
                                className={`
                                  nav-link text-lg font-medium py-3 px-4
                                  text-center no-underline block
                                `}
                                onClick={() => setNavExpanded(false)}
                            >
                                {menuItem.title}
                            </Link>
                        ))}
                        <div
                            className={`
                              border-t border-gray-200
                              dark:border-gray-800
                              my-2
                            `}
                        />
                        <Link
                            href="/contact"
                            className={`
                              primary-button mx-4 mt-2 py-3 text-center
                              no-underline
                            `}
                            onClick={() => setNavExpanded(false)}
                        >
                            Contact Me
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
