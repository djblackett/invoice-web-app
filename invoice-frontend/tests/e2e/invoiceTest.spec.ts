// import { test, expect } from "@playwright/test";
// import { BASE_URL } from "../config";

// import { chromium } from "playwright";

// test("", async () => {
//   (async () => {
//     const browser = await chromium.launch();

//     // Enable video recording
//     const context = await browser.newContext({
//       recordVideo: { dir: "./videos/" }, // Specify the directory to save videos
//     });

//     const page = await context.newPage();

//     // test("has title", async ({ page }) => {
//     //   await page.goto(BASE_URL);
//     //   await expect(page).toHaveTitle(/Frontend Mentor | Invoice app/);
//     // });

//     // test("renders 'Invoices' text", async ({ page }) => {
//     await page.goto(BASE_URL);
//     // Take a full-page screenshot
//     await page.screenshot({ path: "fullpage.png", fullPage: true });
//     // const invoices = page.getByRole("button", { name: /New Invoice/i });
//     const button = page.getByTestId("newInvoiceButton");
//     await expect(button).toBeVisible({ timeout: 30000 * 1000 });

//     await button.click();
//     // });

//     // test("filter drop down opens", async ({ page }) => {
//     //   await page.goto(BASE_URL);

//     //   const filterButton = page.getByText(/Filter/i);
//     //   await expect(filterButton).toBeVisible({ timeout: 70000 });
//     //   await expect(filterButton).toBeEnabled();
//     //   await filterButton.click();

//     //   const draft = page.getByText("Draft");
//     //   await expect(draft).toBeVisible({ timeout: 60000 });
//     //   // await expect(filterButton).toContainText("Pending");
//     //   // await expect(filterButton).toContainText("Paid");
//     // });
//   })();
// });

import { test, expect, chromium } from "@playwright/test";
import { BASE_URL } from "../config";

test("should navigate to the page and interact with elements", async () => {
  const browser = await chromium.launch();

  // Enable video recording
  const context = await browser.newContext({
    recordVideo: { dir: "./videos/" }, // Specify the directory to save videos
  });

  const page = await context.newPage();

  try {
    // Navigate to the base URL
    await page.goto(BASE_URL);

    // Take a full-page screenshot
    await page.screenshot({ path: "fullpage.png", fullPage: true });

    // Locate and verify visibility of the button
    const button = page.getByTestId("newInvoiceButton");
    await expect(button).toBeVisible({ timeout: 5000 });

    // Click the button
    // await button.click();

    // Add assertions to verify behavior after button click
    const filterButton = page.getByTestId("filterButton");
    await expect(filterButton).toBeVisible({ timeout: 5000 });
    await expect(filterButton).toBeEnabled();
    await filterButton.click();

    const draft = page.getByTestId("draft-filter");
    await expect(draft).toBeVisible({ timeout: 5000 });
    await expect(filterButton).toContainText("Pending");
    await expect(filterButton).toContainText("Paid");
  } finally {
    // Clean up resources
    await context.close();
    await browser.close();
  }
});
