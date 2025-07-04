import eslint from "@eslint/js";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
// import pluginSecurity from "eslint-plugin-security";

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
  {
    files: ["**/src/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // tseslint.configs.strict,
  eslintPluginPrettierRecommended,
  // pluginSecurity.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      // Promises
      "@typescript-eslint/no-floating-promises": "error", // un-awaited promises :contentReference[oaicite:3]{index=3}
      "@typescript-eslint/no-misused-promises": "error", // passing promises where a bool/callback was meant :contentReference[oaicite:4]{index=4}
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      // Prefer type-only imports for clarity
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
);
