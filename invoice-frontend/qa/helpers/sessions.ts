import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { expect } from "@playwright/test";
import type { Browser, BrowserContext, Page } from "@playwright/test";

// Facts about the isolated sessions stack that scripts/run-e2e.mjs provisions.
function required(name: string) {
  const value = process.env[name];
  if (!value)
    throw new Error(
      `Run npm run test:e2e to provision isolated services (${name})`,
    );
  return value;
}
export const sessionsApi = () => required("E2E_SESSIONS_API_URL");
export const STORAGE_KEY = "invoice-web-app:demo-session:v1";
const bin = (name: string) => path.join(required("E2E_PG_BIN"), name);
const port = () => required("E2E_SESSIONS_PG_PORT");

/** One statement against the real sessions database. */
export function sql(statement: string) {
  return execFileSync(
    bin("psql"),
    [
      "-h",
      "127.0.0.1",
      "-p",
      port(),
      "-U",
      "postgres",
      "-d",
      "sessions_e2e",
      "-v",
      "ON_ERROR_STOP=1",
      "-tAc",
      statement,
    ],
    { encoding: "utf8" },
  ).trim();
}

// The allocation token bucket is global and persistent (10, refilling 1/min).
export const refillAllocations = () =>
  sql(
    `UPDATE "DemoAllocationState" SET tokens = 10, "updatedAt" = clock_timestamp() WHERE id = 1`,
  );
// Expiry is the server's call; make it true at the source.
export const expireAllSessions = () =>
  // The lifetime constraint pins expiresAt = createdAt + 24 hours.
  sql(
    `UPDATE "DemoSession" SET "createdAt" = clock_timestamp() - interval '3 days', "expiresAt" = clock_timestamp() - interval '2 days'`,
  );
// Spend the lifetime budgets at the source (limits: 200 changes, 5 resets).
export const exhaustChangeBudget = () =>
  sql(`UPDATE "DemoSession" SET "mutationCount" = 200`);
export const exhaustResetAllowance = () =>
  // resetCount > 0 requires lastResetAt; a stale one keeps the cooldown out of play.
  sql(
    `UPDATE "DemoSession" SET "resetCount" = 5, "lastResetAt" = clock_timestamp() - interval '1 day'`,
  );
export const sessionRows = () =>
  Number(sql(`SELECT count(*) FROM "DemoSession"`));

export function stopDatabase() {
  execFileSync(
    bin("pg_ctl"),
    ["-D", required("E2E_SESSIONS_PGDATA"), "stop", "-m", "fast", "-w"],
    { stdio: "ignore" },
  );
}
export function startDatabase() {
  execFileSync(
    bin("pg_ctl"),
    [
      "-D",
      required("E2E_SESSIONS_PGDATA"),
      "-l",
      required("E2E_SESSIONS_PG_LOG"),
      "-o",
      `-p ${port()} -k ${required("E2E_SESSIONS_PG_SOCKET")} -h 127.0.0.1 -c timezone=America/Halifax`,
      "-w",
      "start",
    ],
    { stdio: "ignore" },
  );
}

/** A browser context with its own private test IP (the API trusts one proxy hop). */
export async function newVisitor(
  browser: Browser,
  label: string,
  storageState?: Awaited<ReturnType<BrowserContext["storageState"]>>,
) {
  const hash = createHash("sha256").update(label).digest();
  const context = await browser.newContext({
    baseURL: process.env.E2E_SESSIONS_URL,
    timezoneId: "America/Halifax",
    viewport: { width: 1440, height: 1000 },
    extraHTTPHeaders: {
      "X-Forwarded-For": `10.${hash[0]}.${hash[1]}.${hash[2]}`,
    },
    ...(storageState ? { storageState } : {}),
  });
  return context;
}

export interface Traffic {
  allocations: number;
  operations: string[];
  authorizations: Set<string>;
  sockets: string[];
}

/** Records, without altering, what a page sends to the API and over sockets. */
export function watchTraffic(page: Page): Traffic {
  const traffic: Traffic = {
    allocations: 0,
    operations: [],
    authorizations: new Set(),
    sockets: [],
  };
  page.on("websocket", (socket) => traffic.sockets.push(socket.url()));
  page.on("request", (request) => {
    if (request.method() !== "POST") return;
    if (new URL(request.url()).pathname === "/demo/sessions")
      traffic.allocations++;
    const name = request.postDataJSON()?.operationName;
    if (name) {
      traffic.operations.push(name);
      const auth = request.headers()["authorization"];
      if (auth) traffic.authorizations.add(auth.split(".")[0] ?? "");
    }
  });
  return traffic;
}

/** The stored credential, read only to compare identities (never logged). */
export async function storedSession(page: Page) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw
      ? (JSON.parse(raw) as { credential: string; expiresAt: string })
      : null;
  }, STORAGE_KEY);
}

/** Internal invoice IDs, as the dashboard links name them. */
export async function invoiceIds(page: Page) {
  const hrefs = await page
    .locator('a[href*="/invoices/"]')
    .evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
  return hrefs.map((href) =>
    decodeURIComponent(href.split("/invoices/")[1] ?? ""),
  );
}

export async function expectCanonicalIds(page: Page) {
  const ids = await invoiceIds(page);
  expect(ids).toHaveLength(7);
  for (const id of ids) expect(id).toMatch(/^[A-Z]{2}\d{4}-[0-9a-f-]{36}$/);
}
