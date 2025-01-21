// use your extended Playwright setup
// import { chromium } from "@playwright/test";
// import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/base";

test("should navigate to the page and interact with elements", async ({
  page,
}) => {
  try {
    // Navigate to the base URL
    await page.goto("/invoice-web-app/");

    // Take a full-page screenshot

    // await page.screenshot({ path: "fullpage.png", fullPage: true });

    // Locate and verify visibility of the button
    const button = page.getByTestId("newInvoiceButton");
    await expect(button).toBeVisible({ timeout: 5000 });

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
    // // Clean up resources
    // await context.close();
    // await browser.close();
  }
});
