/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";
const config: Config = {
    content: ["./index.html", "./src/ui/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
    presets: [require("../../packages/shared-components/src/tailwind-colors.preset.ts")],
};

export default config;
