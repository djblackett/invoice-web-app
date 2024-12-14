const config = {
  semi: true,
  singleQuote: false,
  endOfLine: "lf",
  tabWidth: 2,
  trailingComma: "all",
  plugins: [
    "prettier-eslint",
    "eslint-plugin-prettier",
    "eslint-config-prettier",
  ],
  overrides: [
    {
      files: ["*.graphql", "*.gql"],
      options: {
        parser: "graphql",
      },
    },
  ],
};

export default config;
