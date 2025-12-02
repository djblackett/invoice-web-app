/**
 * Global test setup file for Vitest
 * This file is automatically loaded before running tests
 */

import { beforeAll, afterAll, afterEach } from "vitest";

// Setup global test environment
beforeAll(() => {
  // Set test environment variables if needed
  process.env.NODE_ENV = "test";
});

// Cleanup after each test
afterEach(() => {
  // Clear all mocks after each test
  // This is handled by vitest with clearMocks: true in config
});

// Cleanup after all tests
afterAll(() => {
  // Perform any global cleanup
});

// Export empty object to make this a module
export {};
