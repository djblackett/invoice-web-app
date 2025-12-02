/// <reference types="vitest" />

// This file provides type definitions for Vitest globals
// when using globals: true in vitest.config.mts

import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare global {
  namespace Vi {
    interface Matchers<R = unknown> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }
}

export {};
