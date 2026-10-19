import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
for (const name of [".env.local", ".env"]) {
  const file = fileURLToPath(new URL(name, root));
  if (existsSync(file)) loadEnvFile(file);
}
assert.equal(
  process.env.DEMO_MODE,
  "true",
  "This check requires the existing demo authentication.",
);
assert.ok(process.env.DATABASE_URL, "Run neon deploy first.");
assert.match(
  new URL(process.env.DATABASE_URL).hostname,
  /-pooler\..*\.neon\.tech$/,
);

const frontendRequire = createRequire(
  new URL("invoice-frontend/package.json", root),
);
const backendRequire = createRequire(
  new URL("invoice-backend/package.json", root),
);
const { chromium } = frontendRequire("playwright");
const { expect } = frontendRequire("@playwright/test");
const { PrismaClient } = backendRequire("@prisma/client");
const db = new PrismaClient();
const api = process.env.VITE_BACKEND_URL || "http://localhost:8000";
assert.equal((await fetch(new URL("/health", api))).status, 200);
console.log("PASS compiled API health: HTTP 200");

let browser;
let invoiceId;
let addressIds;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  // Reuse the existing demo workspace. Opening this verification session must
  // not invoke the app's deliberate-entry reset of other demo invoices.
  await page.addInitScript(() =>
    sessionStorage.setItem("invoice-demo-session", "ready"),
  );
  await page.goto("http://localhost:5173/invoice-web-app/");
  await expect(page.getByTestId("newInvoiceButton")).toBeVisible();
  console.log("PASS built frontend loads and queries invoices from Neon");

  const client = `Neon verification ${Date.now()}`;
  await page.getByTestId("newInvoiceButton").click();
  const fields = {
    streetAddress: "123 Main Street",
    city: "Halifax",
    postalCode: "B3J 1A1",
    country: "Canada",
    clientName: client,
    clientEmail: "neon-check@example.test",
    clientStreetAddress: "42 Client Lane",
    clientCity: "Dartmouth",
    clientPostalCode: "B2Y 1A1",
    clientCountry: "Canada",
    projectDescription: "Neon persistence check",
  };
  for (const [name, value] of Object.entries(fields)) {
    await page.locator(`input[name="${name}"]`).fill(value);
  }
  await page.getByTestId("invoiceDate").click();
  await page
    .locator(
      ".react-datepicker__day--015:not(.react-datepicker__day--outside-month)",
    )
    .click();
  await page.getByTestId("dropdownHeader").click();
  await page.getByRole("button", { name: "Net 14 Days", exact: true }).click();
  const item = page.getByTestId("invoice-item").first();
  await item.getByPlaceholder("Item name").fill("Neon integration");
  await item.getByPlaceholder("0", { exact: true }).fill("2");
  await item.getByPlaceholder("0.00").fill("125.50");

  async function mutation(name, action) {
    const response = page.waitForResponse(
      (r) =>
        r.request().method() === "POST" &&
        r.request().postDataJSON()?.operationName === name,
    );
    await action();
    const body = await (await response).json();
    assert.equal(body.errors, undefined, JSON.stringify(body.errors));
    return body.data;
  }
  const created = await mutation("addInvoice", () =>
    page.getByRole("button", { name: "Save", exact: true }).click(),
  );
  invoiceId = created.addInvoice.id;
  const persisted = await db.invoice.findUniqueOrThrow({
    where: { id: invoiceId },
  });
  addressIds = {
    client: persisted.clientAddressId,
    sender: persisted.senderAddressId,
  };
  assert.equal(Number(persisted.total), 251);
  assert.equal(persisted.createdById, "demoId");
  assert.equal(await db.invoiceRevision.count({ where: { invoiceId } }), 1);
  console.log("PASS browser create -> GraphQL -> Neon: total 251, revision 1");

  await page
    .locator('a[href*="/invoices/"]')
    .filter({ hasText: invoiceId })
    .click();
  await page.reload();
  await expect(page.getByText(client, { exact: true })).toBeVisible();
  console.log("PASS invoice persists after browser reload");
  await page.getByTestId("edit-button").click();
  await page.locator('input[name="clientName"]').fill(`${client} edited`);
  await page
    .getByTestId("invoice-item")
    .first()
    .getByPlaceholder("0.00")
    .fill("150");
  const edited = await mutation("editInvoice", () =>
    page.getByRole("button", { name: "Save Changes" }).click(),
  );
  assert.equal(edited.editInvoice.total, 300);
  assert.equal(
    Number(
      (await db.invoice.findUniqueOrThrow({ where: { id: invoiceId } })).total,
    ),
    300,
  );
  assert.equal(await db.invoiceRevision.count({ where: { invoiceId } }), 2);
  console.log("PASS browser edit -> Neon: total 300, revision 2");

  await mutation("MarkAsPaid", () =>
    page.getByRole("button", { name: "Mark as Paid" }).click(),
  );
  assert.equal(
    (await db.invoice.findUniqueOrThrow({ where: { id: invoiceId } })).status,
    "paid",
  );
  assert.equal(await db.invoiceRevision.count({ where: { invoiceId } }), 3);
  await page.reload();
  await expect(page.getByTestId("invoice-toolbar")).toContainText("Paid");
  console.log(
    "PASS browser mark paid -> Neon, revision 3, persisted after reload",
  );

  await page
    .getByRole("button", { name: "delete-button", exact: true })
    .click();
  const removed = await mutation("RemoveInvoice", () =>
    page
      .getByRole("button", { name: "delete-button", exact: true })
      .last()
      .click(),
  );
  assert.equal(removed.removeInvoice.acknowledged, true);
  assert.equal(await db.invoice.count({ where: { id: invoiceId } }), 0);
  assert.equal(await db.invoiceRevision.count({ where: { invoiceId } }), 0);
  console.log("PASS browser delete -> Neon: invoice and revisions removed");
  assert.deepEqual(errors, []);
  console.log(
    "PASS no browser runtime errors; Neon end-to-end verification complete",
  );
} finally {
  await browser?.close();
  // Clean up only this run's records, including addresses retained by the
  // existing invoice delete implementation. Never reset the shared workspace.
  if (invoiceId) {
    await db.invoice.deleteMany({ where: { id: invoiceId } });
    if (addressIds?.client)
      await db.clientAddress.deleteMany({
        where: { id: addressIds.client, Invoice: null },
      });
    if (addressIds?.sender)
      await db.senderAddress.deleteMany({
        where: { id: addressIds.sender, Invoice: null },
      });
  }
  await db.$disconnect();
}
