import { test, expect } from "../fixtures/base";
import {
  boot,
  cards,
  createInvoice,
  dashboard,
  noOverflow,
  openInvoice,
  operation,
  result,
} from "../helpers/invoice";

test.beforeEach(async ({ page }) => {
  await boot(page);
});

test("public entry, dashboard, keyboard navigation and theme", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await expect(page.getByTestId("welcome-text")).toHaveText(
    "Please login to view your invoices",
  );
  await expect(page.getByTestId("login-button")).toBeDisabled();
  const entry = page.getByTestId("demo-login-button");
  await expect(entry).toHaveText("Enter Demo Mode");
  await entry.focus();
  await expect(entry).toBeFocused();
  const reset = operation(page, "ResetDemoData");
  await page.keyboard.press("Enter");
  expect((await result(await reset)).resetDemoData).toBe(true);
  await dashboard(page);
  await page.getByTestId("filterButton").click();
  await expect(page.getByTestId("draft-filter")).toContainText("Pending");
  await expect(page.getByTestId("draft-filter").locator("..")).toHaveCSS(
    "height",
    "130px",
  );
  await page.getByTestId("paid-checkbox").click();
  await expect(cards(page)).toHaveCount(2);
  await page.getByTestId("paid-checkbox").click();
  await dashboard(page);
  await page.getByTestId("invoicesTitle").click();
  await noOverflow(page);
  const theme = page.getByRole("button", { name: "Toggle dark mode" });
  await theme.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("sun")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("moon")).toBeVisible();
  await openInvoice(page, "RT3080");
  await noOverflow(page);
  const home = page.getByRole("link", { name: "Go to homepage" });
  await home.focus();
  await page.keyboard.press("Enter");
  await dashboard(page);
});

test("creates a pending invoice, preserves it on navigation, and deletes with confirmation", async ({
  page,
}) => {
  const id = await createInvoice(page);
  await page.reload();
  await expect(
    page.getByText("Browser Test Client", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Go back", exact: true }).click();
  await expect(cards(page)).toHaveCount(8);
  await openInvoice(page, id);
  await expect(
    page.getByText("browser@example.test", { exact: true }),
  ).toBeVisible();
  await noOverflow(page);
  await page
    .getByRole("button", { name: "delete-button", exact: true })
    .click();
  await expect(
    page.getByText("Confirm Deletion", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(
    page.getByText("Confirm Deletion", { exact: true }),
  ).toBeHidden();
  await page
    .getByRole("button", { name: "delete-button", exact: true })
    .click();
  const removed = operation(page, "RemoveInvoice");
  await page
    .getByRole("button", { name: "delete-button", exact: true })
    .last()
    .click();
  expect((await result(await removed)).removeInvoice.acknowledged).toBe(true);
  await dashboard(page);
  await expect(cards(page).filter({ hasText: id })).toHaveCount(0);
});

test("edits an invoice through the form and persists canonical totals after navigation", async ({
  page,
}) => {
  await openInvoice(page, "XM9141");
  await page.getByTestId("edit-button").click();
  await expect(page.getByTestId("edit-title")).toBeVisible();
  await expect(page.getByTestId("invoiceDate")).toHaveValue("08/21/2021");
  await page.locator('input[name="clientName"]').fill("Edited Browser Client");
  const item = page.getByTestId("invoice-item").first();
  await item.getByPlaceholder("0", { exact: true }).fill("3");
  await item.getByPlaceholder("0.00").fill("75.50");
  const saved = operation(page, "editInvoice");
  await page.getByRole("button", { name: "Save Changes" }).click();
  const edited = (await result(await saved)).editInvoice;
  expect(edited.total).toBe(626.5);
  await expect(page.getByTestId("edit-title")).toBeHidden();
  await expect(
    page.getByText("Edited Browser Client", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("£ 626.50", { exact: true }).last(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Go back", exact: true }).click();
  await expect(cards(page).filter({ hasText: "XM9141" })).toContainText(
    "Edited Browser Client",
  );
  await openInvoice(page, "XM9141");
  await expect(
    page.getByText("Edited Browser Client", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Edited Browser Client", { exact: true }),
  ).toBeVisible();
});

test("pending to paid persists after refresh and records history; drafts cannot be paid", async ({
  page,
}) => {
  await openInvoice(page, "XM9141");
  await expect(page.getByTestId("invoice-toolbar")).toContainText("Pending");
  const paid = operation(page, "MarkAsPaid");
  await page.getByRole("button", { name: "Mark as Paid" }).click();
  expect((await result(await paid)).markAsPaid.status).toBe("paid");
  await expect(page.getByTestId("invoice-toolbar")).toContainText("Paid");
  await page.reload();
  await expect(page.getByTestId("invoice-toolbar")).toContainText("Paid");
  await page.getByTestId("history-button").click();
  await expect(page.getByTestId("revision-item-2")).toContainText(
    "Marked as paid",
  );
  await page.getByRole("button", { name: "Close revision history" }).click();
  await page.getByRole("button", { name: "Go back", exact: true }).click();
  await openInvoice(page, "FV2353");
  await expect(page.getByTestId("invoice-toolbar")).toContainText("Draft");
  await expect(
    page.getByRole("button", { name: "Mark as Paid" }),
  ).toBeDisabled();
});

test("inspects canonical revision diffs and restores an earlier revision", async ({
  page,
}) => {
  await openInvoice(page, "RT3080");
  await page.getByTestId("history-button").click();
  await expect(page.getByTestId("revision-history-panel")).toBeVisible();
  await expect(page.getByTestId(/revision-item-/)).toHaveCount(5);
  await expect(
    page.getByRole("heading", { name: "Revision #5 (current)", exact: true }),
  ).toBeVisible();
  const earlier = page.getByTestId("revision-item-2");
  await earlier.focus();
  await page.keyboard.press("Enter");
  await expect(earlier).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("heading", { name: "Revision #2", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Loading changes…", { exact: true }),
  ).toBeHidden();
  const panel = page.getByTestId("revision-history-panel");
  await expect(
    panel.getByRole("heading", { name: "Fields", exact: true }),
  ).toBeVisible();
  await expect(panel).toContainText("Logo Design");
  await expect(panel).toContainText("£1,800.90");
  await noOverflow(page);
  const restored = operation(page, "RestoreInvoiceRevision");
  await page.getByRole("button", { name: "Restore this revision" }).click();
  await expect(page.getByRole("alertdialog")).toContainText(
    "Restore revision #2?",
  );
  await page.getByTestId("confirm-restore-button").click();
  const restoredInvoice = (await result(await restored)).restoreInvoiceRevision;
  expect(restoredInvoice).toMatchObject({
    description: "Website re-brand + logo",
    status: "draft",
    total: 1800.9,
  });
  await expect(page.getByTestId("revision-item-6")).toContainText("restore");
  await page.getByRole("button", { name: "Close revision history" }).click();
  await expect(
    page.getByText(restoredInvoice.description, { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText(restoredInvoice.description, { exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("invoice-toolbar")).toContainText("Draft");
  await expect(page.getByText("£ 1,800.90", { exact: true })).toBeVisible();
  await page.getByTestId("history-button").click();
  await expect(page.getByTestId(/revision-item-/)).toHaveCount(6);
});

test("manual reset and deliberate exit/re-entry restore canonical data and revisions", async ({
  page,
}) => {
  const id = await createInvoice(page, "Reset Me");
  await page.getByRole("button", { name: "Go back", exact: true }).click();
  await openInvoice(page, "RT3080");
  await page.getByTestId("history-button").click();
  await page.getByTestId("revision-item-2").click();
  await page.getByRole("button", { name: "Restore this revision" }).click();
  await page.getByTestId("confirm-restore-button").click();
  await expect(page.getByTestId("revision-item-6")).toBeVisible();
  await page.getByRole("button", { name: "Close revision history" }).click();
  await page.getByRole("button", { name: "Go back", exact: true }).click();
  const reset = operation(page, "ResetDemoData");
  await page.getByRole("button", { name: "Reset Demo", exact: true }).click();
  expect((await result(await reset)).resetDemoData).toBe(true);
  await dashboard(page);
  await expect(cards(page).filter({ hasText: id })).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Logout", exact: true }),
  ).toBeVisible();
  await openInvoice(page, "RT3080");
  await expect(page.getByText("£ 2,101.80", { exact: true })).toBeVisible();
  await page.getByTestId("history-button").click();
  await expect(page.getByTestId(/revision-item-/)).toHaveCount(5);
  await page.getByRole("button", { name: "Close revision history" }).click();
  await page.getByRole("button", { name: "Go back", exact: true }).click();
  await createInvoice(page, "Exit Me");
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await page.getByTestId("demo-login-button").click();
  await dashboard(page);
  await expect(cards(page).filter({ hasText: "Exit Me" })).toHaveCount(0);
});

test("invalid new invoice stays open and does not write to the backend", async ({
  page,
}) => {
  await page.getByTestId("newInvoiceButton").click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Bill From", { exact: true })).toBeVisible();
  await expect(page.locator('input[name="clientName"]')).toHaveValue("");
  await page.getByRole("button", { name: "Discard", exact: true }).click();
  await dashboard(page);
});
