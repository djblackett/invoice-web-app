// npx playwright codegen http://localhost:5173/
import { test, expect, Page } from "@playwright/test";
import { BASE_URL } from "../config";

const maxAttempts = 12;
let attempts = 0;

// Function to check if "September 2024" is visible
async function isSeptemberVisible(page: Page) {
  return await page
    .locator(".react-datepicker__current-month")
    .filter({ hasText: "September 2024" })
    .isVisible();
}

async function cleanUpDB(page: Page) {
  await page.goto(BASE_URL);
  await page.locator("button").filter({ hasText: "Clear Invoices" }).click();
  // await page.locator("button").filter({ hasText: "Delete" }).nth(1).click();
}

test.afterEach(async ({ page }) => {
  await cleanUpDB(page);
});

test("test", async ({ page }) => {
  const name = "Test1" + Math.floor(Math.random() * 1000);
  try {
    await page.goto(BASE_URL);
    await page
      .locator("div")
      .filter({ hasText: /^New Invoice$/ })
      .click();
    await page.locator('input[name="clientName"]').click();

    await page.locator('input[name="clientName"]').fill(name);
    await page
      .locator("div")
      .filter({ hasText: /^Invoice Date$/ })
      .locator("div")
      .nth(2)
      .click();

    while (!(await isSeptemberVisible(page)) && attempts < maxAttempts) {
      await page.getByLabel("Previous Month").click();
      attempts++;

      // Optionally, add a short delay to wait for the UI to update
      await page.waitForTimeout(500);
    }

    if (attempts === maxAttempts) {
      throw new Error(
        "Failed to navigate to September 2024 after maximum attempts.",
      );
    }

    await page.getByLabel("Choose Friday, September 13th,").click();

    // await page.getByTestId("invoiceDate").fill("11/27/2024");
    // await page.locator("body").click();
    await page
      .locator("div")
      .filter({ hasText: /^Net 1 Day$/ })
      .click();
    await page
      .getByRole("button", { name: /Net 14 Days/, includeHidden: true })
      .click();
    await page.getByRole("button", { name: "Save as draft" }).click();

    await page.getByRole("link", { name: name }).click();
    await expect(page.getByText(/13 Sep/)).toBeVisible();
    await expect(page.getByText("27 Sep")).toBeVisible();
    await expect(page.locator("#container")).toContainText(name);
    await page.getByRole("button", { name: "Edit" }).click();
    await expect(
      page
        .locator("div")
        .filter({ hasText: /^Invoice Date$/ })
        .getByRole("textbox"),
    ).toHaveValue("09/13/2024");
    await expect(page.locator("h2")).toContainText("Net 14 Days");
    await page.getByRole("button", { name: "Cancel" }).click();

    await page.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete" }).nth(1).click();
  } finally {
    await page.close();
  }
});

test("invoice is successfully created", async ({ page }) => {
  await page.goto(BASE_URL);
  await page
    .locator("p")
    .filter({ hasText: /^New Invoice$/ })
    .click();
  await page.locator('input[name="streetAddress"]').click();
  await page.locator('input[name="streetAddress"]').fill("1234 street");
  await page.locator('input[name="city"]').click();
  await page.locator('input[name="city"]').fill("Toronto");
  await page.locator('input[name="postalCode"]').click();
  await page.locator('input[name="postalCode"]').fill("b1e7h9");
  await page.locator('input[name="country"]').click();
  await page.locator('input[name="country"]').fill("Canada");
  await page.locator('input[name="clientName"]').click();
  await page.locator('input[name="clientName"]').fill("Ralph D.");
  await page.locator('input[name="clientEmail"]').click();
  await page.locator('input[name="clientEmail"]').fill("ralph_d@gmail.com");
  await page.locator('input[name="clientStreetAddress"]').click();
  await page
    .locator('input[name="clientStreetAddress"]')
    .fill("1543 main street");
  await page.locator('input[name="clientCity"]').click();
  await page.locator('input[name="clientCity"]').fill("Ottawa");
  await page.locator('input[name="clientPostalCode"]').click();
  await page.locator('input[name="clientPostalCode"]').press("Shift+CapsLock");
  await page.locator('input[name="clientPostalCode"]').press("CapsLock");
  await page.locator('input[name="clientPostalCode"]').fill("s7g3f2");
  await page.locator('input[name="clientCountry"]').click();
  await page.locator('input[name="clientCountry"]').fill("Canada");
  await page
    .locator("div")
    .filter({ hasText: /^Invoice Date$/ })
    .locator("div")
    .nth(2)
    .click();
  await page.getByLabel("Choose Wednesday, November 27th,").click();
  await page
    .locator("div")
    .filter({ hasText: /^Net 1 Day$/ })
    .click();
  await page.getByRole("button", { name: "Net 30 Days" }).click();
  await page.locator('input[name="projectDescription"]').click();
  await page
    .locator('input[name="projectDescription"]')
    .fill("Construction supplies");
  await page.getByRole("button", { name: "+ Add New Item" }).click();
  await page.getByPlaceholder("Item name").click();
  await page.getByPlaceholder("Item name").fill("Lumber");
  await page.getByPlaceholder("0", { exact: true }).click();
  await page.getByPlaceholder("0", { exact: true }).fill("10");
  await page.getByPlaceholder("0.00").click();
  await page.getByPlaceholder("0.00").fill("19.99");
  await page.getByRole("button", { name: "+ Add New Item" }).click();
  await page.locator('input[name="items\\[1\\]\\.name"]').click();
  await page.locator('input[name="items\\[1\\]\\.name"]').fill("nails");
  await page.locator('input[name="items\\[1\\]\\.quantity"]').click();
  await page.locator('input[name="items\\[1\\]\\.quantity"]').fill("50");
  await page.locator('input[name="items\\[1\\]\\.price"]').click();
  await page.locator('input[name="items\\[1\\]\\.price"]').fill("0.19");

  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.getByRole("link", { name: "Ralph D. Due 27 Dec" }).click();
  await expect(
    page
      .getByTestId("invoice-toolbar")
      .locator("div")
      .filter({ hasText: "Pending" })
      .nth(1),
  ).toBeVisible();

  await expect(page.locator("#container")).toContainText(
    "Construction supplies",
  );
  await expect(page.locator("#container")).toContainText("27 Nov 2024");
  await expect(page.locator("#container")).toContainText("27 Dec 2024");
  await expect(page.locator("#container")).toContainText("Ralph D.");
  await expect(page.locator("#container")).toContainText("1543 main street");
  await expect(page.locator("#container")).toContainText("Ottawa");
  await expect(page.locator("#container")).toContainText("s7g3f2");
  await expect(page.locator("#container")).toContainText("Canada");
  await expect(page.locator("#container")).toContainText("ralph_d@gmail.com");
  await expect(page.locator("#container")).toContainText("1234 street");
  await expect(page.locator("#container")).toContainText("Toronto");
  await expect(page.locator("#container")).toContainText("b1e7h9");
  await expect(page.locator("#container")).toContainText("Canada");
  await expect(page.locator("#container")).toContainText("Lumber");
  await expect(page.locator("#container")).toContainText("nails");
  await expect(page.locator("#container")).toContainText("10");
  await expect(page.locator("#container")).toContainText("£ 19.99");
  await expect(page.locator("#container")).toContainText("£ 209.40");
  await expect(page.locator("#container")).toContainText("£ 9.50");

  await page.getByRole("button", { name: "Mark as Paid" }).click();
  await expect(page.getByRole("alert")).toContainText("Invoice paid!");
  await expect(page.getByTestId("invoice-toolbar")).toContainText("Paid");
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete" }).nth(1).click();
  await expect(page.locator("#container")).toContainText("New Invoice");
});
