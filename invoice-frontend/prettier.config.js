export const arrowParens = "always";
export const semi = true;
export const trailingComma = "all";
export const singleQuote = false;
export const endOfLine = "lf";
export const indent = "2";
export const plugins = [];

const config = {
  semi: true,
  singleQuote: false,
  endOfLine: "lf",
  indent: "2",
  trailingComma: "all",
  plugins: [
    "eslint-prettier",
    "eslint-plugin-prettier",
    "eslint-config-prettier",
  ],
};

export default config;
