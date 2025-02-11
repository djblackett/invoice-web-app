import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    reporters: ["html", "json", "verbose"],
    outputFile: "./test-output.html",
    include: ["tests/**/*.test.ts"],
    environment: "node",
    exclude: ["tests/**/*.skip.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json", "lcov", "verbose"],
      exclude: [
        "node_modules/",
        "libs/",
        "tests/",
        "dist/",
        "src/generated/",
        "coverage/",
        "src/mocks",
        "eslint.config.mjs",
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
