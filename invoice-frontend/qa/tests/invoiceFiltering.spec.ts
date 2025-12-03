import { expect, test } from "../fixtures/base";
import { generateInvoice } from "../factories/invoice.factory";
import { convertToApiInvoice } from "../helpers/api.helper";
import { waitForNetworkIdle } from "../helpers/test.utils";
import { assertInvoiceCount, assertInvoiceInList } from "../helpers/assertions.helper";
import { TEST_TAGS } from "../config/test.config";

test.describe(`Invoice Filtering ${TEST_TAGS.ui} ${TEST_TAGS.fast}`, () => {
  test.beforeEach(async ({ page, apiHelper }) => {
    await apiHelper.clearDatabase();
    await page.goto("/#/invoices");
    await waitForNetworkIdle(page);
  });

  test("should filter invoices by Draft status", async ({ page, apiHelper }) => {
    // Create test invoices with different statuses
    const draftInvoice = generateInvoice();
    const pendingInvoice = generateInvoice();

    const draft = await apiHelper.createInvoice(convertToApiInvoice(draftInvoice));
    const pending = await apiHelper.createInvoice(convertToApiInvoice(pendingInvoice));

    // Set statuses
    await apiHelper.updateInvoiceStatus(draft.id, "draft");
    await apiHelper.updateInvoiceStatus(pending.id, "pending");

    await page.reload();
    await waitForNetworkIdle(page);

    // Apply draft filter
    await page.getByTestId("filterButton").click();
    await page.getByTestId("draft-filter").click();
    await waitForNetworkIdle(page);

    // Verify only draft invoice is visible
    await assertInvoiceInList(page, draftInvoice.clientName, { status: "Draft" });
    await expect(page.getByText(pendingInvoice.clientName)).not.toBeVisible();

    // Cleanup
    await apiHelper.deleteInvoice(draft.id);
    await apiHelper.deleteInvoice(pending.id);
  });

  test("should filter invoices by Pending status", async ({ page, apiHelper }) => {
    const draftInvoice = generateInvoice();
    const pendingInvoice = generateInvoice();

    const draft = await apiHelper.createInvoice(convertToApiInvoice(draftInvoice));
    const pending = await apiHelper.createInvoice(convertToApiInvoice(pendingInvoice));

    await apiHelper.updateInvoiceStatus(draft.id, "draft");
    await apiHelper.updateInvoiceStatus(pending.id, "pending");

    await page.reload();
    await waitForNetworkIdle(page);

    // Apply pending filter
    await page.getByTestId("filterButton").click();
    await page.getByTestId("pending-filter").click();
    await waitForNetworkIdle(page);

    // Verify only pending invoice is visible
    await assertInvoiceInList(page, pendingInvoice.clientName, { status: "Pending" });
    await expect(page.getByText(draftInvoice.clientName)).not.toBeVisible();

    // Cleanup
    await apiHelper.deleteInvoice(draft.id);
    await apiHelper.deleteInvoice(pending.id);
  });

  test("should filter invoices by Paid status", async ({ page, apiHelper }) => {
    const pendingInvoice = generateInvoice();
    const paidInvoice = generateInvoice();

    const pending = await apiHelper.createInvoice(convertToApiInvoice(pendingInvoice));
    const paid = await apiHelper.createInvoice(convertToApiInvoice(paidInvoice));

    await apiHelper.updateInvoiceStatus(pending.id, "pending");
    await apiHelper.updateInvoiceStatus(paid.id, "paid");

    await page.reload();
    await waitForNetworkIdle(page);

    // Apply paid filter
    await page.getByTestId("filterButton").click();
    await page.getByTestId("paid-filter").click();
    await waitForNetworkIdle(page);

    // Verify only paid invoice is visible
    await assertInvoiceInList(page, paidInvoice.clientName, { status: "Paid" });
    await expect(page.getByText(pendingInvoice.clientName)).not.toBeVisible();

    // Cleanup
    await apiHelper.deleteInvoice(pending.id);
    await apiHelper.deleteInvoice(paid.id);
  });

  test("should show all invoices when no filter is applied", async ({ page, apiHelper }) => {
    const invoice1 = generateInvoice();
    const invoice2 = generateInvoice();
    const invoice3 = generateInvoice();

    const created1 = await apiHelper.createInvoice(convertToApiInvoice(invoice1));
    const created2 = await apiHelper.createInvoice(convertToApiInvoice(invoice2));
    const created3 = await apiHelper.createInvoice(convertToApiInvoice(invoice3));

    await page.reload();
    await waitForNetworkIdle(page);

    // Verify all invoices are visible
    await expect(page.getByText(invoice1.clientName)).toBeVisible();
    await expect(page.getByText(invoice2.clientName)).toBeVisible();
    await expect(page.getByText(invoice3.clientName)).toBeVisible();

    // Cleanup
    await apiHelper.deleteInvoice(created1.id);
    await apiHelper.deleteInvoice(created2.id);
    await apiHelper.deleteInvoice(created3.id);
  });
});
