import { expect } from "@playwright/test";
import type { Page, Response } from "@playwright/test";

export const canonicalBusinesses = {
  AA1449: "Willow Design Co.",
  FV2353: "Juniper Works",
  RG0314: "Fieldwork Studio",
  RT2080: "Oakline Creative",
  RT3080: "Northstar Studio",
  TY9141: "Harbour Collective",
  XM9141: "Cedar & Finch",
};
export const canonicalIds = Object.keys(canonicalBusinesses);
export const cards = (page: Page) => page.locator('a[href*="/invoices/"]');
export function operation(page: Page, name: string) {
  return page.waitForResponse((response) => {
    if (response.request().method() !== "POST") return false;
    return response.request().postDataJSON()?.operationName === name;
  });
}
export async function result(response: Response) {
  expect(response.ok()).toBe(true);
  const body = await response.json();
  expect(body.errors).toBeUndefined();
  return body.data;
}
export async function dashboard(page: Page) {
  await expect(cards(page)).toHaveCount(7);
  for (const [id, clientName] of Object.entries(canonicalBusinesses)) {
    const card = cards(page).filter({ hasText: id });
    await expect(card).toBeVisible();
    await expect(card).toContainText(clientName);
  }
}
export async function boot(page: Page) {
  await page.clock.setFixedTime(new Date("2026-10-17T23:30:00-03:00"));
  await page.goto("");
  await dashboard(page); // Each test owns a fresh browser context and deliberate demo boot/reset.
}
export async function openInvoice(page: Page, id: string) {
  await cards(page).filter({ hasText: id }).click();
  await expect(page.getByTestId("invoice-toolbar")).toBeVisible();
}
export async function noOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      ),
    )
    .toBeLessThanOrEqual(1);
}
export async function createInvoice(
  page: Page,
  clientName = "Browser Test Client",
  // Temporary workspaces use longer internal IDs; the visible number is the
  // first six characters either way.
  idPattern = /^[A-Z]{2}\d{4}$/,
) {
  await page.getByTestId("newInvoiceButton").click();
  await expect(page.getByText("Bill From", { exact: true })).toBeVisible();
  const fields: Record<string, string> = {
    streetAddress: "123 Main Street",
    city: "Halifax",
    postalCode: "B3J 1A1",
    country: "Canada",
    clientName,
    clientEmail: "browser@example.test",
    clientStreetAddress: "42 Client Lane",
    clientCity: "Dartmouth",
    clientPostalCode: "B2Y 1A1",
    clientCountry: "Canada",
    projectDescription: "Browser workflow",
  };
  for (const [name, value] of Object.entries(fields))
    await page.locator(`input[name="${name}"]`).fill(value);
  await page.getByTestId("invoiceDate").click();
  await page
    .locator(
      ".react-datepicker__day--015:not(.react-datepicker__day--outside-month)",
    )
    .click();
  await expect(page.getByTestId("invoiceDate")).toHaveValue(/\d{2}\/15\/\d{4}/);
  await page.getByTestId("dropdownHeader").click();
  await page.getByRole("button", { name: "Net 14 Days", exact: true }).click();
  const item = page.getByTestId("invoice-item").first();
  await item.getByPlaceholder("Item name").fill("Design");
  await item.getByPlaceholder("0", { exact: true }).fill("2");
  await item.getByPlaceholder("0.00").fill("125.50");
  await page.getByRole("button", { name: "+ Add New Item" }).click();
  const second = page.getByTestId("invoice-item").last();
  await second.getByPlaceholder("Item name").fill("Hosting");
  await second.getByPlaceholder("0", { exact: true }).fill("3");
  await second.getByPlaceholder("0.00").fill("40");
  await noOverflow(page);
  const saved = operation(page, "addInvoice");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  const data = await result(await saved);
  const invoice = data.addInvoice;
  expect(invoice.id).toMatch(idPattern);
  const shortId = (invoice.id as string).slice(0, 6);
  expect(shortId).toMatch(/^[A-Z]{2}\d{4}$/);
  expect(invoice.total).toBe(371);
  expect(invoice.status).toBe("pending");
  expect(invoice.paymentTerms).toBe(14);
  expect(invoice.createdAt).toBe("2026-10-15");
  expect(invoice.paymentDue).toBe("2026-10-29");
  await expect(page.getByText("Bill From", { exact: true })).toBeHidden();
  await expect(cards(page)).toHaveCount(8);
  await expect(cards(page).filter({ hasText: clientName })).toContainText(
    shortId,
  );
  await openInvoice(page, shortId);
  await expect(page.getByText(clientName, { exact: true })).toBeVisible();
  await expect(page.getByText("£ 371.00", { exact: true })).toBeVisible();
  return invoice.id as string;
}
