import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [

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
      "codegen.ts",
      "coverage",
      "eslint.config.js"
    ],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
    { files: ["**/*.ts"] },
  {
    rules: {
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
