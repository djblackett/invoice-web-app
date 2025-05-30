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
    ...pluginReact.configs.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    ignores: [
      "dist",
      "build",
      "node_modules",
      "test-examples/*",
      "**/.cache/ms-playwright",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    languageOptions: { globals: globals.browser },
  },
  ...pluginJs.configs.recommended,
  ...pluginPrettier.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strict,
  {
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
      "no-unsafe-return": "off",
    },
  },
);
