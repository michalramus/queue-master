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
                    1: "var(--color-primary-1)",
                    2: "var(--color-primary-2)",
                },
                secondary: {
                    1: "var(--color-secondary-1)",
                    2: "var(--color-secondary-2)",
                },
                accent: {
                    1: "var(--color-accent-1)",
                },

                green: {
                    1: "var(--color-green-1)",
                    2: "var(--color-green-2)",
                },
                blue: {
                    1: "var(--color-blue-1)",
                    2: "var(--color-blue-2)",
                },
                red: {
                    1: "var(--color-red-1)",
                    2: "var(--color-red-2)",
                },

                gray: {
                    1: "var(--color-gray-1)",
                    2: "var(--color-gray-2)",
                },

                text: {
                    1: "var(--color-text-1)",
                    2: "var(--color-text-2)",
                },
            },
        },
    },
    plugins: [],
};
export default config;
