import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import js from "@eslint/js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
    { ignores: ["**/.eslintrc.js", "test/**"] },
    js.configs.recommended,
    ...tsPlugin.configs["flat/recommended"],
    prettierRecommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: "module",
            parserOptions: {
                project: "tsconfig.json",
                tsconfigRootDir: path.resolve(__dirname),
            },
        },

        rules: {
            "@typescript-eslint/interface-name-prefix": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
];
