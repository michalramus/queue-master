import { fixupConfigRules } from "@eslint/compat";
import nextConfig from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
    ...fixupConfigRules(nextConfig),
    ...fixupConfigRules(nextCoreWebVitals),
    ...tanstackQuery.configs["flat/recommended"],
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            "react-hooks/set-state-in-effect": "off",
            "react-hooks/refs": "off",
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
