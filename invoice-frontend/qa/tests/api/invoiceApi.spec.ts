import { test } from "../../fixtures/base";
import { generateInvoice } from "../../factories/invoice.factory";
import { convertToApiInvoice } from "../../helpers/api.helper";
import {
  assertApiResponse,
  assertArrayLength,
  assertObjectContains,
} from "../../helpers/assertions.helper";
import { TEST_TAGS } from "../../config/test.config";

test.describe(`Invoice API Integration ${TEST_TAGS.api} ${TEST_TAGS.fast}`, () => {
  test.beforeEach(async ({ apiHelper }) => {
    await apiHelper.clearDatabase();
  });

  test("should create invoice via API", async ({ apiHelper }) => {
    const invoiceData = generateInvoice();
    const apiInvoice = convertToApiInvoice(invoiceData);

    const result = await apiHelper.createInvoice(apiInvoice);

    // Assert response structure
    assertApiResponse(result, ["id", "clientName", "clientEmail", "status", "total"]);

    // Assert values
    assertObjectContains(result, {
      clientName: invoiceData.clientName,
      clientEmail: invoiceData.clientEmail,
    });

    // Cleanup
    await apiHelper.deleteInvoice(result.id);
  });

  test("should retrieve all invoices via API", async ({ apiHelper }) => {
    // Create multiple invoices
    const invoice1 = convertToApiInvoice(generateInvoice());
    const invoice2 = convertToApiInvoice(generateInvoice());
    const invoice3 = convertToApiInvoice(generateInvoice());

    const created1 = await apiHelper.createInvoice(invoice1);
    const created2 = await apiHelper.createInvoice(invoice2);
    const created3 = await apiHelper.createInvoice(invoice3);

    // Get all invoices
    const invoices = await apiHelper.getInvoices();

    // Assert we have all invoices
    assertArrayLength(invoices, 3);

    // Cleanup
    await apiHelper.deleteInvoice(created1.id);
    await apiHelper.deleteInvoice(created2.id);
    await apiHelper.deleteInvoice(created3.id);
  });

  test("should update invoice status via API", async ({ apiHelper }) => {
    const invoiceData = generateInvoice();
    const apiInvoice = convertToApiInvoice(invoiceData);

    const created = await apiHelper.createInvoice(apiInvoice);

    // Update status to paid
    const updated = await apiHelper.updateInvoiceStatus(created.id, "paid");

    // Assert status was updated
    assertObjectContains(updated, {
      id: created.id,
      status: "paid",
    });

    // Cleanup
    await apiHelper.deleteInvoice(created.id);
  });

  test("should delete invoice via API", async ({ apiHelper }) => {
    const invoiceData = generateInvoice();
    const apiInvoice = convertToApiInvoice(invoiceData);

    const created = await apiHelper.createInvoice(apiInvoice);

    // Delete invoice
    const result = await apiHelper.deleteInvoice(created.id);

    // Assert deletion was successful
    assertObjectContains(result, { success: true });

    // Verify invoice no longer exists
    const invoices = await apiHelper.getInvoices();
    assertArrayLength(invoices, 0);
  });

  test("should handle multiple invoices with same client name", async ({ apiHelper }) => {
    const baseData = generateInvoice();
    const invoice1 = convertToApiInvoice({ ...baseData });
    const invoice2 = convertToApiInvoice({ ...baseData, projectDescription: "Different project" });

    const created1 = await apiHelper.createInvoice(invoice1);
    const created2 = await apiHelper.createInvoice(invoice2);

    const invoices = await apiHelper.getInvoices();
    assertArrayLength(invoices, 2);

    // Cleanup
    await apiHelper.deleteInvoice(created1.id);
    await apiHelper.deleteInvoice(created2.id);
  });

  test("should calculate correct total for invoice items", async ({ apiHelper }) => {
    const invoiceData = generateInvoice({
      items: [
        { description: "Item 1", quantity: 2, price: 100 },
        { description: "Item 2", quantity: 3, price: 50 },
      ],
    });
    const apiInvoice = convertToApiInvoice(invoiceData);

    const created = await apiHelper.createInvoice(apiInvoice);

    // Expected total: (2 * 100) + (3 * 50) = 350
    const expectedTotal = 350;

    // Assert total is calculated correctly
    assertObjectContains(created, {
      total: expectedTotal,
    });

    // Cleanup
    await apiHelper.deleteInvoice(created.id);
  });

  test("should preserve invoice data integrity", async ({ apiHelper }) => {
    const invoiceData = generateInvoice();
    const apiInvoice = convertToApiInvoice(invoiceData);

    const created = await apiHelper.createInvoice(apiInvoice);

    // Retrieve all invoices
    const invoices = await apiHelper.getInvoices();
    const retrieved = invoices.find(inv => inv.id === created.id);

    // Assert all data is preserved
    assertObjectContains(retrieved, {
      id: created.id,
      clientName: invoiceData.clientName,
      clientEmail: invoiceData.clientEmail,
    });

    // Cleanup
    await apiHelper.deleteInvoice(created.id);
  });
});
