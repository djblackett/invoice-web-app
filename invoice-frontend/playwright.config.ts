import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();
const TEST_BASE_URL = process.env.TEST_BASE_URL;

// Define __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Playwright Test Configuration
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "qa",
  testMatch: "**/*.spec.ts",

  // Timeout configuration
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000, // Timeout for expect assertions
  },

  globalSetup: "./global-setup",

  /* Run tests in files in parallel - can enable once tests are fully stable */
  fullyParallel: false,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry configuration - retry once on CI */
  retries: process.env.CI ? 1 : 0,

  /* Workers configuration - sequential for now, can increase once stable */
  workers: process.env.CI ? 1 : 1,

  /* Reporter configuration - multiple reporters for better visibility */
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
    ["list"], // Console output
    ...(process.env.CI ? [["github" as const]] : []),
  ],

  /* Shared settings for all projects */
  use: {
    baseURL: TEST_BASE_URL,

    // Screenshot configuration
    screenshot: {
      mode: "only-on-failure",
      fullPage: true,
    },

    // Video configuration - only on failure to save space
    video: process.env.CI ? "retain-on-failure" : "on-first-retry",

    // Trace configuration - capture on retry
    trace: "on-first-retry",

    // Network configuration
    ignoreHTTPSErrors: true,

    // Authentication state
    storageState: path.resolve(__dirname, "state.json"),

    // Action timeout
    actionTimeout: 10 * 1000,

    // Navigation timeout
    navigationTimeout: 15 * 1000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ["--ignore-certificate-errors"],
        },
      },
    },

    // Uncomment to enable Firefox testing
    // {
    //   name: "firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //   },
    // },

    // Uncomment to enable WebKit testing
    // {
    //   name: "webkit",
    //   use: {
    //     ...devices["Desktop Safari"],
    //   },
    // },

    // Mobile viewports - uncomment to enable
    // {
    //   name: "Mobile Chrome",
    //   use: {
    //     ...devices["Pixel 5"],
    //   },
    // },
    // {
    //   name: "Mobile Safari",
    //   use: {
    //     ...devices["iPhone 13"],
    //   },
    // },
  ],

  /* Output folder for test artifacts */
  outputDir: "test-results",

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  snapshotDir: "qa/snapshots",

  /* Maximum concurrent failures before stopping */
  maxFailures: process.env.CI ? 5 : undefined,
});
