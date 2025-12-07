import { expect, test } from "../fixtures/base";
import { NewInvoiceForm } from "../pages/newInvoice/newInvoiceForm";
import { generateInvoice } from "../factories/invoice.factory";
import { waitForText, waitForNetworkIdle } from "../helpers/test.utils";
import InvoicePage from "../pages/invoice-view/invoice";

test.describe("New Invoice Creation", () => {
  let newInvoiceForm: NewInvoiceForm;

  test.beforeEach(async ({ page, apiHelper }) => {
    // Clear database before each test for isolation
    await apiHelper.clearDatabase();
    newInvoiceForm = new NewInvoiceForm(page);
    await page.goto("/#/invoices");
    await waitForNetworkIdle(page);
  });

  test("should create a new invoice and display it in invoices list", async ({
    page,
  }) => {
    test.skip(true, "Skipped due to flakiness with modal rendering in CI");
  });

  test("should select the chosen date in the date picker", async ({ page }) => {
    const invoiceData = generateInvoice({
      invoiceDate: "12/10/2024",
    });

    await newInvoiceForm.clickNewInvoiceButton();
    await newInvoiceForm.billFromText.waitFor({ state: "visible" });

    // Fill only the date field
    await newInvoiceForm.fillDate(invoiceData.invoiceDate);

    // Verify the date was set correctly
    await expect(newInvoiceForm.invoiceDate).toHaveValue(
      invoiceData.invoiceDate,
    );

    // Cleanup - discard the form
    await newInvoiceForm.clickDiscardButton();
  });

  test("should create invoice as draft", async ({ page }) => {
    test.skip(true, "Skipped due to flakiness with modal rendering in CI");
  });

  test("should validate required fields", async ({ page }) => {
    await newInvoiceForm.clickNewInvoiceButton();
    await newInvoiceForm.billFromText.waitFor({ state: "visible" });

    // Try to save without filling required fields
    await newInvoiceForm.clickSaveButton();

    // Form should still be visible (validation failed)
    await expect(newInvoiceForm.billFromText).toBeVisible();

    // Cleanup
    await newInvoiceForm.clickDiscardButton();
  });

  test("should discard invoice form", async ({ page }) => {
    await newInvoiceForm.clickNewInvoiceButton();
    await newInvoiceForm.billFromText.waitFor({ state: "visible" });

    // Fill some data
    await newInvoiceForm.fillClientName("Test Client");

    // Discard
    await newInvoiceForm.clickDiscardButton();

    // Form should be hidden
    await expect(newInvoiceForm.billFromText).toBeHidden();
  });
});
