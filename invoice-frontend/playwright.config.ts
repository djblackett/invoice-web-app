import { defineConfig, devices } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Define __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let authToken;
try {
  const filePath = path.join(__dirname, "authToken.json");
  authToken = JSON.parse(fs.readFileSync(filePath, "utf-8")).token;
} catch (error) {
  console.error("Failed to read token:", error.message);
  process.exit(1); // Exit process if token read fails
}

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require("dotenv").config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // testDir: "qa", //"./tests/e2e",
  testMatch: "**/*.spec.ts",
  timeout: 30 * 1000,
  globalSetup: "./global-setup",
  /* Run tests in files in parallel */
  // fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.CI
      ? "https://localhost:4173/invoice-web-app/"
      : "https://localhost:5173/invoice-web-app/",
    video: "on",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    // ignoreHTTPSErrors: true,
    storageState: "state.json",
    extraHTTPHeaders: {
      Authorization: `Bearer ${authToken}`, // Attach the token to every request
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // ignoreHTTPSErrors: true,
        launchOptions: {
          args: ["--ignore-certificate-errors"],
        },
      },
    },
    // {
    //   name: "firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //     launchOptions: {
    //       args: ["--ignore-certificate-errors"],
    //     },
    //   },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  // command: process.env.CI
  //   ? "npm run build && npm run preview && npx wait-on http://localhost:4173/invoice-web-app/"
  //   : "npm run dev",
  // url: process.env.CI
  //   ? "http://localhost:4173/invoice-web-app"
  //   : "http://localhost:5173/invoice-web-app",
  //   reuseExistingServer: !process.env.CI,
  // },
});
