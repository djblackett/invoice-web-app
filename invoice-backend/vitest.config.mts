// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      reporter: ["text", "json", "html"],
    },
    include: ["tests/**/*.test.ts"],
    // setupFiles: ["./vitest.setup.ts"],
    environment: "node", // or 'jsdom' for browser environment
  },
});
