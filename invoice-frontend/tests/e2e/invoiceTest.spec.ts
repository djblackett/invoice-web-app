import { test, expect } from "@playwright/test";
import { BASE_URL } from "../config";

test.describe("", () => {
  test("has title", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Frontend Mentor | Invoice app/);
  });

  test("renders 'Invoices' text", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.getByTestId("invoicesTitle")).toHaveText("Invoices");
  });

  test("filter drop down opens", async ({ page }) => {
    await page.goto(BASE_URL);

    const filterButton = page.getByTestId("filterButton");
    await expect(filterButton).toBeVisible({ timeout: 60000 });
    await expect(filterButton).toBeEnabled();
    await filterButton.click();

    await expect(filterButton).toContainText("Draft");
    await expect(filterButton).toContainText("Pending");
    await expect(filterButton).toContainText("Paid");
  });
});
