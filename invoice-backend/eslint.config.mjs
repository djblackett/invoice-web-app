import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    ignores: [
      "build",
      "node_modules",
      "prisma",
      ".env",
      "*.json",
      "*.yml",
      "src/mocks",
      "src/generated",
    ],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      indent: ["warn", 2],
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
