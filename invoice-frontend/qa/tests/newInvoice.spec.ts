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
    // Generate unique test data
    const invoiceData = generateInvoice();

    // Create invoice using UI
    await newInvoiceForm.createInvoice(invoiceData);

    // Verify invoice appears in list
    await waitForText(page, invoiceData.clientName);
    await expect(page.getByText(invoiceData.clientName)).toBeVisible();

    // Cleanup - delete the created invoice
    await page.getByRole("link", { name: invoiceData.clientName }).click();
    const invoicePage = new InvoicePage(page);
    await invoicePage.deleteInvoice();
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
    const invoiceData = generateInvoice();

    // Create draft invoice
    await newInvoiceForm.createDraftInvoice(invoiceData);

    // Verify invoice appears in list
    await waitForText(page, invoiceData.clientName);
    await expect(page.getByText(invoiceData.clientName)).toBeVisible();

    // Verify it has draft status
    const draftBadge = page.locator(`text=Draft`).first();
    await expect(draftBadge).toBeVisible();

    // Cleanup
    await page.getByRole("link", { name: invoiceData.clientName }).click();
    const invoicePage = new InvoicePage(page);
    await invoicePage.deleteInvoice();
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
