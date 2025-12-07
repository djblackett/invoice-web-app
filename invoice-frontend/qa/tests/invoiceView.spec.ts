import { expect, test } from "../fixtures/base";
import { generateInvoice } from "../factories/invoice.factory";
import { convertToApiInvoice } from "../helpers/api.helper";
import InvoicePage from "../pages/invoice-view/invoice";
import { waitForText, waitForNetworkIdle } from "../helpers/test.utils";

test.describe.skip("Invoice View Operations", () => {
  let invoiceData: any;
  let createdInvoiceId: string;

  test.beforeEach(async ({ page, apiHelper }) => {
    // Clear database
    await apiHelper.clearDatabase();

    // Generate unique test data
    invoiceData = generateInvoice();

    // Create invoice via API for faster setup
    const apiInvoice = convertToApiInvoice(invoiceData);
    const result = await apiHelper.createInvoice(apiInvoice);
    createdInvoiceId = result.id;

    // Navigate to invoices page
    await page.goto("/#/invoices");
    await waitForNetworkIdle(page);
  });

  test.afterEach(async ({ apiHelper }) => {
    // Cleanup - delete invoice if it still exists
    if (createdInvoiceId) {
      try {
        await apiHelper.deleteInvoice(createdInvoiceId);
      } catch (error) {
        // Invoice may already be deleted by the test
      }
    }
  });

  test("should mark invoice as paid", async ({ page }) => {
    // Click on the invoice to view details
    await page.getByText(invoiceData.clientName).click();
    await waitForNetworkIdle(page);

    const invoicePage = new InvoicePage(page);

    // Mark as paid
    await invoicePage.markAsPaid();

    // Verify status changed to "Paid"
    const status = page.getByText("Paid", { exact: true });
    await expect(status).toBeVisible();
  });

  test("should delete an invoice", async ({ page }) => {
    // Verify invoice is visible in the list
    await expect(page.getByText(invoiceData.clientName)).toBeVisible();

    // Click on the invoice to view details
    await page.getByText(invoiceData.clientName).click();
    await waitForNetworkIdle(page);

    const invoicePage = new InvoicePage(page);

    // Delete the invoice
    await invoicePage.deleteInvoice();

    // Verify invoice is no longer visible in the list
    const deletedInvoice = page.getByText(invoiceData.clientName);
    await expect(deletedInvoice).not.toBeVisible();

    // Clear the ID since we already deleted it
    createdInvoiceId = "";
  });

  test("should navigate back to invoice list", async ({ page }) => {
    // Click on the invoice to view details
    await page.getByText(invoiceData.clientName).click();
    await waitForNetworkIdle(page);

    const invoicePage = new InvoicePage(page);

    // Click go back
    await invoicePage.clickGoBackButton();
    await waitForNetworkIdle(page);

    // Verify we're back on the invoices list page
    await expect(page.getByText(invoiceData.clientName)).toBeVisible();
  });

  test("should open edit modal", async ({ page }) => {
    // Click on the invoice to view details
    await page.getByText(invoiceData.clientName).click();
    await waitForNetworkIdle(page);

    const invoicePage = new InvoicePage(page);

    // Click edit button
    await invoicePage.clickEditButton();

    // Verify edit form is visible
    const editFormTitle = page.getByText("Edit Invoice");
    await expect(editFormTitle).toBeVisible();

    // Cancel to close the form
    await invoicePage.clickCancelButton();
  });
});
