import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json", "lcov"],
      exclude: [
        "node_modules/",
        "tests/",
        "dist/",
        "coverage/",
        "qa/",
        "src/types/",
        "src/styles/",
        "src/assets/",
        "src/graphql/",
        "global-setup.ts",
        "eslint.config.js",
        "tsconfig.json",
        "playwright.config.ts",
        "prettier.config.js",
        "vite.config.ts",
        "vitest.config.mts",
      ],
      all: true, // Collect coverage for all files, not just the ones tested
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
