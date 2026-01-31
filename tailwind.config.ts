import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#A62C21",
                "accent-gold": "#A62C21",
                "background-light": "#FFFFFF",
                "background-dark": "#000000",
                "surface-light": "#FFFFFF",
                "surface-dark": "#1A1A1A",
            },
            fontFamily: {
                display: ["var(--font-playfair)", "serif"],
                sans: ["var(--font-jakarta)", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "1rem",
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
};
export default config;
