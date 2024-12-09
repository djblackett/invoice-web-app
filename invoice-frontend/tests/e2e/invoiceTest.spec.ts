import { test, expect } from "@playwright/test";
import { BASE_URL } from "../config";

test.describe("", () => {
  // test("has title", async ({ page }) => {
  //   await page.goto(BASE_URL);
  //   await expect(page).toHaveTitle(/Frontend Mentor | Invoice app/);
  // });

  test("renders 'Invoices' text", async ({ page }) => {
    await page.goto(BASE_URL);
    // const invoices = page.getByRole("button", { name: /New Invoice/i });
    const button = page.getByTestId("newInvoiceButton");
    await expect(button).toBeVisible({ timeout: 200 * 1000 });

    await button.click();
  });

  // test("filter drop down opens", async ({ page }) => {
  //   await page.goto(BASE_URL);

  //   const filterButton = page.getByText(/Filter/i);
  //   await expect(filterButton).toBeVisible({ timeout: 70000 });
  //   await expect(filterButton).toBeEnabled();
  //   await filterButton.click();

  //   const draft = page.getByText("Draft");
  //   await expect(draft).toBeVisible({ timeout: 60000 });
  //   // await expect(filterButton).toContainText("Pending");
  //   // await expect(filterButton).toContainText("Paid");
  // });
});
