import { expect, test } from "../fixtures/base";
import { generateInvoice } from "../factories/invoice.factory";
import { convertToApiInvoice } from "../helpers/api.helper";
import { EditForm } from "../pages/edit/editForm";
import InvoicePage from "../pages/invoice-view/invoice";
import { waitForNetworkIdle } from "../helpers/test.utils";

test.describe("Edit Invoice", () => {
  let invoiceData: any;
  let createdInvoiceId: string;

  test.beforeEach(async ({ page, apiHelper }) => {
    // Clear database
    await apiHelper.clearDatabase();

    // Generate unique test data with specific date
    invoiceData = generateInvoice({
      invoiceDate: "01/30/2025",
    });

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

  test("should show the correct date in the form when edit page is opened", async ({
    page,
  }) => {
    // Click on the invoice to view details
    await page.getByRole("link", { name: invoiceData.clientName }).click();
    await waitForNetworkIdle(page);

    const invoicePage = new InvoicePage(page);
    await invoicePage.clickEditButton();

    const editForm = new EditForm(page);

    // Verify the date is pre-filled correctly
    await expect(editForm.invoiceDate).toHaveValue(invoiceData.invoiceDate);

    // Cancel the edit
    await invoicePage.clickCancelButton();
  });

  test("should allow editing client name", async ({ page }) => {
    // Click on the invoice to view details
    await page.getByRole("link", { name: invoiceData.clientName }).click();
    await waitForNetworkIdle(page);

    const invoicePage = new InvoicePage(page);
    await invoicePage.clickEditButton();

    const editForm = new EditForm(page);

    // Update client name
    const newClientName = "Updated Client Name";
    await editForm.fillClientName(newClientName);

    // Save changes
    await editForm.clickSaveButton();
    await waitForNetworkIdle(page);

    // Verify the updated name is displayed
    await expect(page.getByText(newClientName)).toBeVisible();
  });

  test("should allow changing invoice date", async ({ page }) => {
    // Click on the invoice to view details
    await page.getByRole("link", { name: invoiceData.clientName }).click();
    await waitForNetworkIdle(page);

    const invoicePage = new InvoicePage(page);
    await invoicePage.clickEditButton();

    const editForm = new EditForm(page);

    // Change the date
    const newDate = "02/15/2025";
    await editForm.fillDate(newDate);

    // Verify the date was updated in the form
    await expect(editForm.invoiceDate).toHaveValue(newDate);

    // Cancel without saving
    await invoicePage.clickCancelButton();
  });

  test("should allow canceling edit without saving changes", async ({
    page,
  }) => {
    const originalClientName = invoiceData.clientName;

    // Click on the invoice to view details
    await page.getByRole("link", { name: originalClientName }).click();
    await waitForNetworkIdle(page);

    const invoicePage = new InvoicePage(page);
    await invoicePage.clickEditButton();

    const editForm = new EditForm(page);

    // Make changes
    await editForm.fillClientName("This Should Not Be Saved");

    // Cancel
    await invoicePage.clickCancelButton();
    await waitForNetworkIdle(page);

    // Verify original name is still displayed
    await expect(page.getByText(originalClientName)).toBeVisible();
  });
});
