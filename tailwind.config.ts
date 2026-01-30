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
                primary: "#8B6B4E",
                "accent-gold": "#C5A059",
                "background-light": "#FDFBF4",
                "background-dark": "#1A1612",
                "surface-light": "#FFFFFF",
                "surface-dark": "#25211D",
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
