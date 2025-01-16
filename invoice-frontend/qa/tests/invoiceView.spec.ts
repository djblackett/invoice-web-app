import { expect, test } from "../fixtures/base";
import {
  createExampleInvoice,
  NewInvoiceForm,
} from "../pages/newInvoice/newInvoiceForm";
import { chromium } from "@playwright/test";

test.beforeEach(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  await page.goto("https://localhost:5173/invoice-web-app/");
  const newInvoiceForm = new NewInvoiceForm(page);
  await createExampleInvoice(newInvoiceForm);
});

test("Should mark invoice as paid", async ({ invoiceMainPage }) => {
  await invoiceMainPage.gotoPage();

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

// should edit an invoice and save the changes

// should delete an invoice
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
