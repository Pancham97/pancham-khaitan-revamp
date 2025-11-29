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
            fontFamily: {},
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
