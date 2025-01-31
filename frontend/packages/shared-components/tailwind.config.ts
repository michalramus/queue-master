/* eslint-disable @typescript-eslint/no-require-imports */

import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],

    theme: {
        extend: {},
    },
    plugins: [],
    presets: [require("./src/tailwind-colors.preset.ts")],
};

export default config;
