import { test, expect } from "@playwright/test";

test("Create and verify an invoice", async ({ page }) => {
  await page.goto("/invoice-web-app/", { timeout: 5000 });

  await expect(page).toHaveTitle(/Frontend Mentor | Invoice app/);

  // Create a new invoice
  const newInvoiceButton = page.getByTestId("newInvoiceButton");
  await expect(newInvoiceButton).toBeVisible({ timeout: 60000 });
  await expect(newInvoiceButton).toBeEnabled();
  await newInvoiceButton.click();

  const clientName = `TestClient_${Date.now()}`;

  await page.fill('input[name="clientName"]', clientName);
  await page.fill('input[name="streetAddress"]', "1234 Elm Street");
  await page.fill('input[name="city"]', "Toronto");
  await page.fill('input[name="postalCode"]', "M1A1A1");
  await page.fill('input[name="country"]', "Canada");

  //   // const dateText = page
  //   //   .locator(".react-datepicker__current-month")
  //   //   .textContent();
  //   // expect(dateText).toBeTruthy();

  //   // Set invoice date
  //   // let attempts = 0;
  //   // while (
  //   // !(
  //   //     await page.locator(".react-datepicker__current-month").textContent()
  //   //   ).includes("September 2024") &&
  //   //   attempts < maxAttempts
  //   // ) {
  //   //   await page.getByLabel("Previous Month").click();
  //   //   attempts++;
  //   // }
  //   // if (attempts >= maxAttempts)
  //   //   throw new Error("Failed to navigate to September 2024");

  //   // await page.getByLabel("Choose Friday, September 13th,").click();

  //   // await page.getByRole("button", { name: "Save as draft" }).click();

  //   // // Verify the saved invoice
  //   // await expect(page.getByRole("link", { name: clientName })).toBeVisible();
  //   // await page.getByRole("link", { name: clientName }).click();
  //   // await expect(page.locator("#container")).toContainText(clientName);
  //   // await expect(page.locator("#container")).toContainText("13 Sep 2024");
});
