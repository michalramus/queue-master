/* eslint-disable @typescript-eslint/no-require-imports */
module.exports = {
    theme: {
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
    plugins: [require("@tailwindcss/typography")],
};
