import { expect, test } from "../fixtures/base";
import {
  createExampleInvoice,
  NewInvoiceForm,
} from "../pages/newInvoice/newInvoiceForm";
import { chromium } from "@playwright/test";
import { clearDatabase, TEST_BASE_URL } from "../../global-setup";

if (!process.env.TEST_BASE_URL) {
  throw new Error("TEST_URL is not defined");
}

test.beforeEach(async () => {
  await clearDatabase();
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  await page.goto(TEST_BASE_URL!);
  const newInvoiceForm = new NewInvoiceForm(page);
  await createExampleInvoice(newInvoiceForm);
});

test("Should mark invoice as paid", async ({ invoiceMainPage }) => {
  await invoiceMainPage.gotoPage();

  if (process.env.NODE_ENV === "CI") {
    await invoiceMainPage.page.screenshot({
      path: "before-clicking-invoice.png",
    });
  }

  await invoiceMainPage.page.getByText("Jack Sparrow").click();
  await invoiceMainPage.page.getByTestId("mark-as-paid").click();
  await invoiceMainPage.page.waitForTimeout(2000);

  const status = await invoiceMainPage.page.getByText("Paid", { exact: true });

  await expect(status).toBeVisible();

  await invoiceMainPage.page.getByRole("button", { name: "Delete" }).click();
  await invoiceMainPage.page
    .getByRole("button", { name: "Delete" })
    .nth(1)
    .click();
});

test("Should delete an invoice", async ({ invoiceMainPage }) => {
  await invoiceMainPage.gotoPage();

  await invoiceMainPage.page.getByText("Jack Sparrow").click();
  await invoiceMainPage.page.getByRole("button", { name: "Delete" }).click();
  await invoiceMainPage.page
    .getByRole("button", { name: "Delete" })
    .nth(1)
    .click();
  await invoiceMainPage.page.waitForTimeout(2000);

  const deletedInvoice = await invoiceMainPage.page.getByText("Jack Sparrow");
  await expect(deletedInvoice).not.toBeVisible();
});
