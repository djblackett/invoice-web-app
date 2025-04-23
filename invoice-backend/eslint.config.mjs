import eslint from "@eslint/js";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

// /** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  globalIgnores([
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/out/**",
    "**/generated/**",
    "**/src/mocks/**",
  ]),
  { files: ["**/*.{ts,tsx}"] },
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  tseslint.configs.strict,
  eslintPluginPrettierRecommended,
  {
    rules: {
      // "@typescript-eslint/no-unnecessary-condition": "error",
    },
  },
);
