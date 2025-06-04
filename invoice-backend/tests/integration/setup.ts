import { beforeAll } from "vitest";

// Silence console.error for all tests (useful for expected errors)
beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});