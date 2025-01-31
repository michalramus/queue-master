import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...compat.extends(
        "next",
        "next/core-web-vitals",
        "prettier",
        "plugin:@tanstack/eslint-plugin-query/recommended",
    ),
    {
        plugins: {},

        rules: {
            "react/self-closing-comp": [
                "error",
                {
                    component: true,
                    html: true,
                },
            ],

            "@tanstack/query/exhaustive-deps": "error",
            "@tanstack/query/no-rest-destructuring": "warn",
            "@tanstack/query/stable-query-client": "error",
        },
    },
];
