import { visitorTest as test, expect } from "../fixtures/base";
import { boot, cards, createInvoice, dashboard } from "../helpers/invoice";
import {
  refillAllocations,
  startDatabase,
  stopDatabase,
  storedSession,
  watchTraffic,
} from "../helpers/sessions";

// These tests stop and restart the real sessions PostgreSQL cluster. They run
// after every other sessions test (see playwright.config.ts) and always bring
// the database back.
test.afterEach(() => {
  try {
    startDatabase();
  } catch {
    /* already running */
  }
});

test("a database outage keeps the stored workspace and Retry resumes it", async ({
  page,
}) => {
  refillAllocations();
  await boot(page);
  const id = await createInvoice(
    page,
    "Survives Outage",
    /^[A-Z]{2}\d{4}-[0-9a-f-]{36}$/,
  );
  await page.getByRole("button", { name: "Go back", exact: true }).click();
  await expect(cards(page)).toHaveCount(8);
  const before = await storedSession(page);
  const traffic = watchTraffic(page);

  stopDatabase();
  await page.reload();
  await expect(page.getByRole("alert")).toContainText(
    "Invoices could not be loaded.",
    {
      timeout: 30_000,
    },
  );
  // Unavailable is not expired: nothing was discarded and no new workspace was asked for.
  expect(await storedSession(page)).toEqual(before);
  expect(traffic.allocations).toBe(0);
  await expect(page.getByText("This demo workspace has expired.")).toHaveCount(
    0,
  );

  startDatabase();
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(cards(page)).toHaveCount(8, { timeout: 30_000 });
  await expect(cards(page).filter({ hasText: "Survives Outage" })).toHaveCount(
    1,
  );
  expect(await storedSession(page)).toEqual(before);
  expect(id).toBeTruthy();
});

test("a failed first allocation stops, explains itself and only retries on request", async ({
  page,
}) => {
  refillAllocations();
  stopDatabase();
  const traffic = watchTraffic(page);
  await page.goto("");
  await expect(page.getByRole("alert")).toContainText("couldn't be started", {
    timeout: 30_000,
  });
  // Left alone, nothing loops.
  await page.waitForTimeout(3000);
  expect(traffic.allocations).toBe(1);
  expect(await storedSession(page)).toBeNull();

  startDatabase();
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await dashboard(page);
  expect(traffic.allocations).toBe(2);
  expect(await storedSession(page)).not.toBeNull();
});
