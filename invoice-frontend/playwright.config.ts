import { defineConfig, devices } from "@playwright/test";

const artifacts = process.env.E2E_ARTIFACTS || "test-results";
export default defineConfig({
  testDir: "qa/tests",
  fullyParallel: false,
  // The shared-demo suites share demoId; the temporary-session suites share one
  // allocation bucket and one database they restart. Never run in parallel.
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  outputDir: `${artifacts}/results`,
  reporter: [
    ["list"],
    ["html", { outputFolder: `${artifacts}/playwright-report`, open: "never" }],
    ["json", { outputFile: `${artifacts}/results.json` }],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL,
    timezoneId: "America/Halifax",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: { executablePath: process.env.E2E_CHROMIUM_EXECUTABLE },
  },
  projects: [
    {
      name: "chromium-desktop",
      testMatch: [
        "demo.spec.ts",
        "session.spec.ts",
        "toast.spec.ts",
        "loading.spec.ts",
        "sharedDemoUnchanged.spec.ts",
      ],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "chromium-mobile",
      testMatch: ["demo.spec.ts", "session.spec.ts"],
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "temporary-sessions",
      testMatch: ["temporarySessions.spec.ts"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
        baseURL: process.env.E2E_SESSIONS_URL,
      },
    },
    {
      name: "temporary-sessions-mobile",
      testMatch: ["temporarySessionsMobile.spec.ts"],
      use: { ...devices["Pixel 5"], baseURL: process.env.E2E_SESSIONS_URL },
    },
    {
      // Stops and restarts the sessions database, so it runs after every other
      // sessions test and never alongside one.
      name: "temporary-sessions-outage",
      testMatch: ["temporarySessionsOutage.spec.ts"],
      dependencies: ["temporary-sessions", "temporary-sessions-mobile"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
        baseURL: process.env.E2E_SESSIONS_URL,
      },
    },
    {
      name: "demo-disabled",
      testMatch: "disabled.spec.ts",
      use: { baseURL: process.env.E2E_DISABLED_URL },
    },
    ...(process.env.E2E_FIREFOX_EXECUTABLE
      ? [
          {
            name: "firefox-smoke",
            testMatch: "demo.spec.ts",
            grep: /public entry/,
            use: {
              ...devices["Desktop Firefox"],
              launchOptions: {
                executablePath: process.env.E2E_FIREFOX_EXECUTABLE,
              },
            },
          },
        ]
      : []),
  ],
});
