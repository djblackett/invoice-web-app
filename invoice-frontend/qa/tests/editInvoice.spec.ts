import { expect, test } from "../fixtures/base";
import {
  createExampleInvoice,
  NewInvoiceForm,
} from "../pages/newInvoice/newInvoiceForm";

import { clearDatabase, TEST_BASE_URL } from "../../global-setup";
import { EditForm } from "../pages/edit/editForm";
import InvoicePage from "../pages/invoice-view/invoice";

test.beforeEach(async () => {
  await clearDatabase();
});

test("should show the correct date already in the form when the edit page is opened", async ({
  page,
}) => {
  const newInvoiceForm = new NewInvoiceForm(page);

  // Navigate to the invoice page if not already there
  await page.goto(`${TEST_BASE_URL}#/invoices`);
  await page.waitForLoadState("networkidle");

  await createExampleInvoice(newInvoiceForm);
  await page.getByText("Jack Sparrow").waitFor({ state: "visible" });

  await page.getByRole("link", { name: "Jack Sparrow" }).click();

  const invoicePage = new InvoicePage(page);
  await invoicePage.clickEditButton();

  const editForm = new EditForm(page);
  const datePicker = editForm.invoiceDate;
  await expect(await datePicker).toHaveValue("01/30/2025");

  await page.getByRole("button", { name: "Cancel" }).click();
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete" }).nth(1).click();
});

test("should select the chosen date in the date picker", async ({ page }) => {
  const newInvoiceForm = new NewInvoiceForm(page);

  // Navigate to the invoice page if not already there
  await page.goto(`${TEST_BASE_URL}#/invoices`);
  await page.waitForLoadState("networkidle");

  await createExampleInvoice(newInvoiceForm);
  await page.getByText("Jack Sparrow").waitFor({ state: "visible" });

  await page.getByRole("link", { name: "Jack Sparrow" }).click();

  const invoicePage = new InvoicePage(page);
  await invoicePage.clickEditButton();

  const editForm = new EditForm(page);
  const datePicker = editForm.invoiceDate;
  await expect(await datePicker).toHaveValue("01/30/2025");

  await datePicker.click();

  await page.getByRole("button", { name: "Cancel" }).click();
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete" }).nth(1).click();
});
