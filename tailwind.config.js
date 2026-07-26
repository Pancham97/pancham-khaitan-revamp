/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class", // Enable manual theme toggle via .dark class
    theme: {
        extend: {
            colors: {
                accent: "#1f1f1f",
                "phantom-black": "#0a0a0a",
                "custom-grey": "#6f6f6f",
            },
            fontFamily: {
                serif: [
                    "var(--font-source-serif)",
                    "Source Serif 4",
                    "Georgia",
                    "serif",
                ],
                mono: [
                    "ui-monospace",
                    "SFMono-Regular",
                    "Menlo",
                    "Monaco",
                    "Consolas",
                    "monospace",
                ],
            },
            /* Readable floor: never below 16px sitewide */
            fontSize: {
                xs: ["1rem", { lineHeight: "1.45" }], // 16px
                sm: ["1.0625rem", { lineHeight: "1.5" }], // 17px
                base: ["1.125rem", { lineHeight: "1.65" }], // 18px
                lg: ["1.25rem", { lineHeight: "1.55" }], // 20px
                xl: ["1.375rem", { lineHeight: "1.45" }], // 22px
                "2xl": ["1.625rem", { lineHeight: "1.3" }], // 26px
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
