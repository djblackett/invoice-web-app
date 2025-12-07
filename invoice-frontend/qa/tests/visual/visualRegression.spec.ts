import { test, expect } from "../../fixtures/base";
import { generateInvoice } from "../../factories/invoice.factory";
import { convertToApiInvoice } from "../../helpers/api.helper";
import { waitForNetworkIdle } from "../../helpers/test.utils";
import { TEST_TAGS } from "../../config/test.config";

/**
 * Visual Regression Tests
 *
 * These tests take screenshots and compare them to baseline images.
 * Run with --update-snapshots to update baseline screenshots.
 *
 * Usage:
 *   npx playwright test --update-snapshots  # Update baselines
 *   npx playwright test visual              # Run visual tests
 */

test.describe(`Visual Regression ${TEST_TAGS.ui} ${TEST_TAGS.slow}`, () => {
  test.beforeEach(async ({ page, apiHelper }) => {
    await apiHelper.clearDatabase();
  });

  test("should match invoice list page screenshot", async ({ page }) => {
    await page.goto("/#/invoices");
    await waitForNetworkIdle(page);

    // Take screenshot and compare to baseline
    await expect(page).toHaveScreenshot("invoice-list-empty.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test.skip("should match invoice list with invoices screenshot", async () => {});

  test("should match new invoice form screenshot", async ({ page }) => {
    await page.goto("/#/invoices");
    await waitForNetworkIdle(page);

    await page.getByTestId("newInvoiceButton").click();
    await page.getByText("Bill From").waitFor({ state: "visible" });

    await expect(page).toHaveScreenshot("new-invoice-form.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test.skip("should match invoice detail page screenshot", async () => {});

  test("should match dark mode screenshot", async ({ page }) => {
    await page.goto("/#/invoices");
    await waitForNetworkIdle(page);

    // Switch to dark mode
    await page.getByTestId("dark-mode-button").click();
    await page.getByTestId("sun").waitFor({ state: "visible" });

    await expect(page).toHaveScreenshot("invoice-list-dark-mode.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("should match mobile viewport screenshot", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/#/invoices");
    await waitForNetworkIdle(page);

    await expect(page).toHaveScreenshot("invoice-list-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("should match tablet viewport screenshot", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto("/#/invoices");
    await waitForNetworkIdle(page);

    await expect(page).toHaveScreenshot("invoice-list-tablet.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
