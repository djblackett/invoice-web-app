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
      "dist",
      "global-setup.ts",
    ],
  },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },

  { languageOptions: {} },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      "linebreak-style": ["warn", "unix"],
      quotes: ["warn", "double"],
      semi: ["warn", "always"],
      "@typescript-eslint/no-explicit-any": "off", // May want to turn this on later
      "array-callback-return": "off",
      "consistent-return": "off",
      "no-plusplus": "off",
      "no-param-reassign": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "no-unsafe-return": "off",
    },
  },
];
