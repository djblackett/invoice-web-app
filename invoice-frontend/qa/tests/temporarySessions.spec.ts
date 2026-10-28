import { test, expect, visitorTest } from "../fixtures/base";
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
import {
  STORAGE_KEY,
  expectCanonicalIds,
  exhaustChangeBudget,
  exhaustResetAllowance,
  expireAllSessions,
  sessionsApi,
  invoiceIds,
  newVisitor,
  refillAllocations,
  storedSession,
  watchTraffic,
} from "../helpers/sessions";

// Full internal ID: the visible six-character number, a dash, a UUID.
const FULL_ID = /^[A-Z]{2}\d{4}-[0-9a-f-]{36}$/;

test.beforeEach(() => {
  refillAllocations();
});

test("first-time visitor gets a private workspace with the canonical dashboard", async ({
  page,
}) => {
  const traffic = watchTraffic(page);
  const allocated = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/demo/sessions" &&
      response.request().method() === "POST",
  );
  await boot(page);
  expect((await allocated).status()).toBe(201);
  await expectCanonicalIds(page);
  await expect(page.getByTestId("demo-workspace-notice")).toContainText(
    "Private demo workspace",
  );
  // The shared reset and the shared identity are never involved.
  expect(traffic.operations).not.toContain("ResetDemoData");
  expect(traffic.operations).toContain("allInvoices");
  expect([...traffic.authorizations]).toEqual(["Bearer demo-session-v1"]);
  expect(traffic.allocations).toBe(1);
  // A bearer secret never appears in the address bar.
  const stored = await storedSession(page);
  expect(stored?.credential).toMatch(/^demo-session-v1\.[0-9a-f]{64}$/);
  expect(page.url()).not.toContain(stored?.credential ?? "");
  await noOverflow(page);
  // Familiar six-character numbers on screen, full IDs only in routes.
  await openInvoice(page, "RT3080");
  expect(page.url()).toMatch(/#\/invoices\/RT3080-[0-9a-f-]{36}$/);
  await expect(page.getByTestId("invoice-toolbar")).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/RT3080-[0-9a-f]{8}/);
});

test("creates, edits, pays, deletes and inspects history inside the workspace", async ({
  page,
}) => {
  await boot(page);
  // Create
  const id = await createInvoice(page, "Session Client", FULL_ID);
  expect(id).toMatch(FULL_ID);
  await page.getByRole("button", { name: "Go back", exact: true }).click();
  await expect(cards(page)).toHaveCount(8);

  // Edit
  await openInvoice(page, "XM9141");
  await page.getByTestId("edit-button").click();
  await page.locator('input[name="clientName"]').fill("Edited In Session");
  const saved = operation(page, "editInvoice");
  await page.getByRole("button", { name: "Save Changes" }).click();
  expect((await result(await saved)).editInvoice.clientName).toBe(
    "Edited In Session",
  );
  await expect(page.getByTestId("edit-title")).toBeHidden();
  await expect(
    page.getByText("Edited In Session", { exact: true }),
  ).toBeVisible();

  // Pay (still XM9141: pending -> paid)
  const paid = operation(page, "MarkAsPaid");
  await page.getByRole("button", { name: "Mark as Paid" }).click();
  expect((await result(await paid)).markAsPaid.status).toBe("paid");
  await expect(page.getByTestId("invoice-toolbar")).toContainText("Paid");

  // History and diff for that invoice
  await page.getByTestId("history-button").click();
  await expect(page.getByTestId("revision-item-3")).toContainText(
    "Marked as paid",
  );
  await page.getByRole("button", { name: "Close revision history" }).click();

  // Delete the invoice created above, via its short number
  await page.getByRole("button", { name: "Go back", exact: true }).click();
  await openInvoice(page, id.slice(0, 6));
  await page
    .getByRole("button", { name: "delete-button", exact: true })
    .click();
  await expect(
    page.getByRole("dialog").or(page.getByText("Confirm Deletion")),
  ).toBeVisible();
  // The confirmation shows the familiar number, not the internal ID.
  await expect(
    page.getByText(`delete invoice #${id.slice(0, 6)}?`),
  ).toBeVisible();
  const removed = operation(page, "RemoveInvoice");
  await page
    .getByRole("button", { name: "delete-button", exact: true })
    .last()
    .click();
  expect((await result(await removed)).removeInvoice.acknowledged).toBe(true);
  await expect(cards(page)).toHaveCount(7);
  await expect(
    cards(page).filter({ hasText: "Edited In Session" }),
  ).toHaveCount(1);
});

test("compares and restores an earlier revision", async ({ page }) => {
  await boot(page);
  await openInvoice(page, "RT3080");
  await page.getByTestId("history-button").click();
  await expect(page.getByTestId(/revision-item-/)).toHaveCount(5);
  await page.getByTestId("revision-item-2").click();
  await expect(
    page.getByRole("heading", { name: "Revision #2", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Loading changes…", { exact: true }),
  ).toBeHidden();
  await expect(page.getByTestId("revision-history-panel")).toContainText(
    "Logo Design",
  );
  await expect(page.getByTestId("revision-history-panel")).not.toContainText(
    /RT3080-[0-9a-f]{8}/,
  );
  const restored = operation(page, "RestoreInvoiceRevision");
  await page.getByRole("button", { name: "Restore this revision" }).click();
  await page.getByTestId("confirm-restore-button").click();
  const invoice = (await result(await restored)).restoreInvoiceRevision;
  expect(invoice.id).toMatch(FULL_ID);
  expect(invoice).toMatchObject({
    clientName: "Northstar Studio",
    status: "draft",
  });
  await expect(page.getByTestId("revision-item-6")).toContainText("restore");
});

test("refresh and a reopened browser resume the same workspace", async ({
  page,
  browser,
}) => {
  await boot(page);
  const id = await createInvoice(page, "Survives Reload", FULL_ID);
  const before = await storedSession(page);
  await page.reload();
  await expect(
    page.getByText("Survives Reload", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Go back", exact: true }).click();
  await expect(cards(page)).toHaveCount(8);
  expect(await storedSession(page)).toEqual(before);

  // "Reopen the browser": a brand-new context seeded only with persisted
  // storage (sessionStorage and in-memory state do not survive).
  const state = await page.context().storageState();
  const reopened = await newVisitor(browser, "reopened", state);
  try {
    const next = await reopened.newPage();
    const traffic = watchTraffic(next);
    await next.goto("");
    await expect(cards(next)).toHaveCount(8);
    await expect(
      cards(next).filter({ hasText: "Survives Reload" }),
    ).toHaveCount(1);
    expect(await invoiceIds(next)).toContain(id);
    expect(traffic.allocations).toBe(0);
    expect(traffic.operations).not.toContain("ResetDemoData");
    expect(await storedSession(next)).toEqual(before);
  } finally {
    await reopened.close();
  }
});

test("two visitors get different workspaces and never see each other's changes", async ({
  browser,
}) => {
  const a = await newVisitor(browser, "visitor-a");
  const b = await newVisitor(browser, "visitor-b");
  try {
    const pageA = await a.newPage();
    const pageB = await b.newPage();
    await pageA.clock.setFixedTime(new Date("2026-10-17T23:30:00-03:00"));
    await pageB.clock.setFixedTime(new Date("2026-10-17T23:30:00-03:00"));
    await pageA.goto("");
    await dashboard(pageA);
    await pageB.goto("");
    await dashboard(pageB);

    const sessionA = await storedSession(pageA);
    const sessionB = await storedSession(pageB);
    expect(sessionA?.credential).toBeTruthy();
    expect(sessionA?.credential).not.toEqual(sessionB?.credential);
    const idsA = await invoiceIds(pageA);
    const idsB = await invoiceIds(pageB);
    // Same visible numbers, entirely different internal rows.
    expect(idsA.map((id) => id.slice(0, 6)).sort()).toEqual(
      idsB.map((id) => id.slice(0, 6)).sort(),
    );
    expect(idsA.filter((id) => idsB.includes(id))).toEqual([]);

    // A creates and edits; B is untouched, even after a refresh.
    await createInvoice(pageA, "Only Visitor A", FULL_ID);
    await pageA.getByRole("button", { name: "Go back", exact: true }).click();
    await openInvoice(pageA, "XM9141");
    await pageA.getByTestId("edit-button").click();
    await pageA.locator('input[name="clientName"]').fill("A Edited This");
    const saved = operation(pageA, "editInvoice");
    await pageA.getByRole("button", { name: "Save Changes" }).click();
    await result(await saved);
    await pageB.reload();
    await dashboard(pageB);
    await expect(
      cards(pageB).filter({ hasText: "Only Visitor A" }),
    ).toHaveCount(0);
    await expect(cards(pageB).filter({ hasText: "A Edited This" })).toHaveCount(
      0,
    );

    // B deletes a canonical invoice; A's copy is unaffected.
    await openInvoice(pageB, "TY9141");
    await pageB
      .getByRole("button", { name: "delete-button", exact: true })
      .click();
    const removed = operation(pageB, "RemoveInvoice");
    await pageB
      .getByRole("button", { name: "delete-button", exact: true })
      .last()
      .click();
    await result(await removed);
    await expect(cards(pageB)).toHaveCount(6);
    await pageA.goto("#/invoices");
    await pageA.reload();
    await expect(cards(pageA)).toHaveCount(8);
    await expect(cards(pageA).filter({ hasText: "TY9141" })).toHaveCount(1);

    // A's internal ID is not even addressable from B's workspace.
    await pageB.goto(`#/invoices/${idsA[0]}`);
    await expect(
      pageB.getByText("Invoice may have been deleted"),
    ).toBeVisible();
    await expect(pageB.getByTestId("invoice-toolbar")).toHaveCount(0);
  } finally {
    await a.close();
    await b.close();
  }
});

// The next tests provoke errors on purpose (obsolete IDs, expired credentials,
// refused resets), so they use the plain visitor fixture without the
// "no console or GraphQL errors" guard.

visitorTest(
  "reset restores the canonical invoices, keeps the session and invalidates old internal IDs",
  async ({ page }) => {
    const traffic = watchTraffic(page);
    await boot(page);
    const before = await storedSession(page);
    const oldIds = await invoiceIds(page);

    await createInvoice(page, "Gone After Reset", FULL_ID);
    await page.getByRole("button", { name: "Go back", exact: true }).click();
    await openInvoice(page, "RT3080");
    const oldRoute = page.url();
    await page.getByTestId("history-button").click();
    await page.getByTestId("revision-item-2").click();
    await page.getByRole("button", { name: "Restore this revision" }).click();
    await page.getByTestId("confirm-restore-button").click();
    await expect(page.getByTestId("revision-item-6")).toBeVisible();
    await page.getByRole("button", { name: "Close revision history" }).click();
    await page.getByRole("button", { name: "Go back", exact: true }).click();

    page.once("dialog", (dialog) => void dialog.accept());
    const reset = operation(page, "ResetDemoSession");
    await page.getByRole("button", { name: "Reset Demo", exact: true }).click();
    expect((await result(await reset)).resetDemoSession).toBe(true);

    await dashboard(page);
    await expect(page).toHaveURL(/#\/invoices$/);
    await expect(
      cards(page).filter({ hasText: "Gone After Reset" }),
    ).toHaveCount(0);
    await expectCanonicalIds(page);
    const newIds = await invoiceIds(page);
    expect(newIds.filter((id) => oldIds.includes(id))).toEqual([]);
    // Same session, same original expiry.
    expect(await storedSession(page)).toEqual(before);
    expect(traffic.operations).toContain("ResetDemoSession");
    expect(traffic.operations).not.toContain("ResetDemoData");

    // RT3080's history is canonical again (five revisions, not six).
    await openInvoice(page, "RT3080");
    await page.getByTestId("history-button").click();
    await expect(page.getByTestId(/revision-item-/)).toHaveCount(5);
    await page.getByRole("button", { name: "Close revision history" }).click();

    // A bookmark of the pre-reset invoice fails gracefully, with a way back.
    await page.goto(oldRoute);
    await expect(page.getByText("Invoice may have been deleted")).toBeVisible();
    await expect(page.getByTestId("invoice-toolbar")).toHaveCount(0);
    await page.getByRole("button", { name: "Go back", exact: true }).click();
    await dashboard(page);
  },
);

visitorTest(
  "a refused reset (cooldown) keeps the workspace and explains why",
  async ({ page }) => {
    await boot(page);
    page.on("dialog", (dialog) => void dialog.accept());
    const first = operation(page, "ResetDemoSession");
    await page.getByRole("button", { name: "Reset Demo", exact: true }).click();
    await result(await first);
    await dashboard(page);

    await createInvoice(page, "Kept After Failed Reset", FULL_ID);
    await page.getByRole("button", { name: "Go back", exact: true }).click();
    const before = await storedSession(page);

    const second = operation(page, "ResetDemoSession");
    await page.getByRole("button", { name: "Reset Demo", exact: true }).click();
    const body = await (await second).json();
    expect(body.errors[0].extensions.code).toBe("RESET_COOLDOWN");
    await expect(
      page.getByRole("alert").filter({ hasText: /cooling down/i }),
    ).toBeVisible();
    // Nothing was discarded: same credential, same invoices, same page.
    expect(await storedSession(page)).toEqual(before);
    await expect(cards(page)).toHaveCount(8);
    await expect(
      cards(page).filter({ hasText: "Kept After Failed Reset" }),
    ).toHaveCount(1);
  },
);

visitorTest(
  "a workspace that expires offers a new demo and never replays the interrupted change",
  async ({ page }) => {
    const traffic = watchTraffic(page);
    await boot(page);
    const before = await storedSession(page);
    await openInvoice(page, "XM9141");
    await page.getByTestId("edit-button").click();
    await page.locator('input[name="clientName"]').fill("Never Saved");

    expireAllSessions(); // the server, not the browser, ends the workspace
    await page.getByRole("button", { name: "Save Changes" }).click();

    await expect(page.getByRole("alert")).toContainText(
      "This demo workspace has expired.",
    );
    await expect(
      page.getByRole("button", { name: "Start a new demo" }),
    ).toBeVisible();
    // The expired credential is kept until a replacement exists, and the edit
    // was attempted exactly once.
    expect(await storedSession(page)).toEqual(before);
    expect(
      traffic.operations.filter((name) => name === "editInvoice"),
    ).toHaveLength(1);
    expect(traffic.allocations).toBe(1);

    await page.getByRole("button", { name: "Start a new demo" }).click();
    await dashboard(page);
    expect(traffic.allocations).toBe(2);
    expect(
      traffic.operations.filter((name) => name === "editInvoice"),
    ).toHaveLength(1);
    const after = await storedSession(page);
    expect(after?.credential).toBeTruthy();
    expect(after?.credential).not.toEqual(before?.credential);
    // The new workspace is canonical: the unfinished edit did not follow.
    await expect(cards(page).filter({ hasText: "Never Saved" })).toHaveCount(0);
    await expect(cards(page).filter({ hasText: "Cedar & Finch" })).toHaveCount(
      1,
    );
    // The abandoned form does not come back either.
    await openInvoice(page, "XM9141");
    await page.getByTestId("edit-button").click();
    await expect(page.locator('input[name="clientName"]')).toHaveValue(
      "Cedar & Finch",
    );
  },
);

visitorTest(
  "an expired stored workspace shows recovery on return",
  async ({ page }) => {
    await boot(page);
    const before = await storedSession(page);
    expireAllSessions();
    await page.reload();
    await expect(page.getByRole("alert")).toContainText(
      "This demo workspace has expired.",
    );
    await expect(page.getByTestId("newInvoiceButton")).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Reset Demo" }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "Start a new demo" }).click();
    await dashboard(page);
    expect((await storedSession(page))?.credential).not.toEqual(
      before?.credential,
    );
  },
);

visitorTest(
  "an advisory-expired stored credential shows recovery without trusting the clock to delete it",
  async ({ page }) => {
    await page.addInitScript(
      ([key, backend]) => {
        localStorage.setItem(
          key,
          JSON.stringify({
            credential: `demo-session-v1.${"a".repeat(64)}`,
            expiresAt: new Date(Date.now() - 3600_000).toISOString(),
            backend,
          }),
        );
      },
      [STORAGE_KEY, new URL(sessionsApi()).origin] as const,
    );
    const traffic = watchTraffic(page);
    await page.goto("");
    await expect(page.getByRole("alert")).toContainText(
      "This demo workspace has expired.",
    );
    expect(traffic.allocations).toBe(0);
    expect(traffic.operations).toEqual([]);
  },
);

test("never opens a WebSocket, anywhere in the workflow", async ({ page }) => {
  const traffic = watchTraffic(page);
  await boot(page);
  await createInvoice(page, "No Sockets", FULL_ID);
  await page.getByRole("button", { name: "Go back", exact: true }).click();
  await openInvoice(page, "RT3080");
  await page.getByTestId("history-button").click();
  await expect(page.getByTestId(/revision-item-/)).toHaveCount(5);
  await page.reload();
  await expect(page.getByTestId("invoice-toolbar")).toBeVisible();
  expect(traffic.sockets).toEqual([]);
});

test("the default backend does not offer temporary sessions", async ({
  request,
}) => {
  const shared = process.env.E2E_API_URL;
  if (!shared)
    throw new Error("Run npm run test:e2e to provision isolated services");
  const response = await request.post(`${shared}/demo/sessions`, {
    data: {},
    headers: { "X-Forwarded-For": "10.9.9.9" },
  });
  expect(response.status()).toBe(404);
});

visitorTest(
  "a second tab of the same browser follows the workspace it shares",
  async ({ page, context }) => {
    await boot(page);
    const before = await storedSession(page);
    const second = await context.newPage();
    await second.goto("");
    await dashboard(second);
    expect(await storedSession(second)).toEqual(before); // shared, not a second workspace

    // Tab one starts a new demo; tab two must not keep showing the old one.
    page.once("dialog", (dialog) => void dialog.accept());
    await page.getByRole("button", { name: "Start a new demo" }).click();
    await expect
      .poll(() => storedSession(page).then((s) => s?.credential))
      .not.toEqual(before?.credential);
    await dashboard(page);
    const after = await storedSession(page);
    await expect
      .poll(() => storedSession(second).then((s) => s?.credential))
      .toEqual(after?.credential);
    await dashboard(second);
    const idsOne = await invoiceIds(page);
    const idsTwo = await invoiceIds(second);
    expect(idsTwo.sort()).toEqual(idsOne.sort());
  },
);

visitorTest(
  "used-up quotas explain themselves, keep the form and its content, and point to a new demo",
  async ({ page }) => {
    await boot(page);
    exhaustChangeBudget();
    await page.getByTestId("newInvoiceButton").click();
    await page.locator('input[name="clientName"]').fill("Unsaved Draft Client");
    await page.getByTestId("saveDraft").click();
    await expect(
      page.getByRole("alert").filter({ hasText: /used all of its changes/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("alert").filter({ hasText: /Start a new demo/ }),
    ).toBeVisible();
    // The refused save did not close or clear the form.
    await expect(page.getByText("Bill From", { exact: true })).toBeVisible();
    await expect(page.locator('input[name="clientName"]')).toHaveValue(
      "Unsaved Draft Client",
    );
    await page.getByRole("button", { name: "Discard", exact: true }).click();

    exhaustResetAllowance();
    page.on("dialog", (dialog) => void dialog.accept());
    await page.getByRole("button", { name: "Reset Demo", exact: true }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: /no resets|used all of its/ }),
    ).toBeVisible();
    await dashboard(page);

    // The way out is always on screen, and replaces the workspace.
    const before = await storedSession(page);
    await page.getByRole("button", { name: "Start a new demo" }).click();
    await dashboard(page);
    expect((await storedSession(page))?.credential).not.toEqual(
      before?.credential,
    );
  },
);
