import { test, expect } from "@playwright/test";
import { BASE_URL } from "../config";

// const maxAttempts = 12;

// test.afterEach(async ({ page }) => {
//   // Ensure cleanup after each test
//   await page.goto(BASE_URL);
//   await page.getByRole("button", { name: "Clear Invoices" }).click();
// });

test("Create and verify an invoice", async ({ page }) => {
  const clientName = `TestClient_${Date.now()}`;

  await page.goto(BASE_URL);

  await expect(page).toHaveTitle(/Frontend Mentor | Invoice app/);

  // Create a new invoice
  await page.getByTestId("newInvoiceButton").click();
  await page.fill('input[name="clientName"]', clientName);
  await page.fill('input[name="streetAddress"]', "1234 Elm Street");
  await page.fill('input[name="city"]', "Toronto");
  await page.fill('input[name="postalCode"]', "M1A1A1");
  await page.fill('input[name="country"]', "Canada");

  // Set invoice date
  // let attempts = 0;
  // while (
  // !(
  //     await page.locator(".react-datepicker__current-month").textContent()
  //   ).includes("September 2024") &&
  //   attempts < maxAttempts
  // ) {
  //   await page.getByLabel("Previous Month").click();
  //   attempts++;
  // }
  // if (attempts >= maxAttempts)
  //   throw new Error("Failed to navigate to September 2024");

  // await page.getByLabel("Choose Friday, September 13th,").click();

  // await page.getByRole("button", { name: "Save as draft" }).click();

  // // Verify the saved invoice
  // await expect(page.getByRole("link", { name: clientName })).toBeVisible();
  // await page.getByRole("link", { name: clientName }).click();
  // await expect(page.locator("#container")).toContainText(clientName);
  // await expect(page.locator("#container")).toContainText("13 Sep 2024");
});
