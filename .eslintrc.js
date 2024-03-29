/* eslint-env node */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: ["react", "jest"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": [0, "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    eqeqeq: "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": ["error", "always"],
    "arrow-spacing": ["error", { before: true, after: true }],
    "no-console": 0,
    "react/prop-types": 1,
    "react/react-in-jsx-scope": "off",
    "no-unused-vars": 0,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
