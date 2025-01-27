import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "dist",
      "build",
      "node_modules",
      "test-examples/*",
      "**/.cache/ms-playwright",
    ],
  },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    languageOptions: {
      globals: globals.node,
      parser: "@typescript-eslint/parser", // Specify TypeScript parser
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "commonjs",
        project: "./tsconfig.json", // Path to your tsconfig.json
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      // indent: ["warn", 2],
      "linebreak-style": ["warn", "unix"],
      quotes: ["warn", "double"],
      semi: ["warn", "always"],
      "@typescript-eslint/no-explicit-any": "off", // May want to turn this on later
      "array-callback-return": "off",
      "consistent-return": "off",
      "no-plusplus": "off",
      "no-param-reassign": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unsafe-return": "off",
    },
  },
];
