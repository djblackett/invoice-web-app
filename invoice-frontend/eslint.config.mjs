import globals from "globals";

// Ensure the 'browser' property exists in the imported 'globals'
if (!globals.browser) {
  throw new Error(
    "The 'browser' property is not defined in the 'globals' package. Please verify your 'globals' package version.",
  );
}
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";

// /** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  {
    ignores: [
      "dist",
      "build",
      "node_modules",
      "test-examples/*",
      "**/.cache/ms-playwright",
      "coverage/**",
      "*.config.mjs",
      "*.config.js",
      "*.config.ts",
      "*.config.mts",
      "tests/**",
      "qa/**",
      "global-setup.ts",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strict,
  {
    plugins: {
      react: pluginReact,
      prettier: pluginPrettier,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "array-callback-return": "off",
      "consistent-return": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-props-no-spreading": "off",
      "no-plusplus": "off",
      "no-param-reassign": "off",
      "react/require-default-props": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-enum-comparison": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-dynamic-delete": "off",
    },
  },
);
