import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                primary: {
                    1: "#27CE5E",
                    2: "#11b046",
                },
                secondary: {
                    1: "#DCFFDC",
                    2: "#91e6ad",
                },
                accent: {
                    1: "#3BFF72",
                },

                green: {
                    1: "#63cb6b",
                    2: "#21ba2d",
                },
                blue: {
                    1: "#689ff0",
                    2: "#2071e9",
                },
                red: {
                    1: "#e6705d",
                    2: "#e04c34",
                },

                gray: {
                    1: "#4b5563",
                    2: "#B1B2B5",
                },
            },
        },
    },
    plugins: [],
};
export default config;
