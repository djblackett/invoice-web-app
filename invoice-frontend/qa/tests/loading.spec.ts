import type { Page, TestInfo } from "@playwright/test";
import { test, expect } from "../fixtures/base";
import { cards, dashboard, noOverflow, openInvoice } from "../helpers/invoice";

type Timings = { shell?: number; loading?: number; invoices?: number };
async function measure(page: Page) {
  await page.addInitScript(() => {
    const timings: Timings = {};
    Object.assign(window, { invoiceLoadTimings: timings });
    new MutationObserver(() => {
      for (const [name, selector] of Object.entries({
        shell: '[data-testid="header"]',
        loading: '[data-testid="invoice-content-status"]',
        invoices: '[data-testid="invoice-card"]',
      })) {
        const key = name as keyof Timings;
        if (timings[key] === undefined && document.querySelector(selector))
          timings[key] = performance.now();
      }
    }).observe(document, { childList: true, subtree: true });
  });
}
async function timings(page: Page) {
  return page.evaluate(
    () =>
      (window as unknown as { invoiceLoadTimings: Timings }).invoiceLoadTimings,
  );
}
async function titlePosition(page: Page) {
  const box = await page.getByTestId("invoicesTitle").boundingBox();
  if (!box) throw new Error("Dashboard heading must be visible");
  return { x: box.x, y: box.y, height: box.height };
}
async function capture(page: Page, info: TestInfo, name: string) {
  await info.attach(name, {
    body: await page.screenshot({ fullPage: true }),
    contentType: "image/png",
  });
}
function gate() {
  let release = () => {};
  const promise = new Promise<void>((resolve) => {
    release = resolve;
  });
  return { promise, release };
}

for (const width of [1440, 768, 390]) {
  test(`delayed initialization and invoice query preserve the shell at ${width}px`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 1000 });
    await measure(page);
    const api = process.env.E2E_API_URL;
    if (!api || new URL(api).hostname !== "127.0.0.1")
      throw new Error("Disposable local API required");
    const reset = gate();
    const query = gate();
    const operations: string[] = [];
    const completed: string[] = [];
    await page.route(`${api}/`, async (route) => {
      const name = route.request().postDataJSON()?.operationName;
      operations.push(name);
      if (name === "ResetDemoData") await reset.promise;
      if (name === "allInvoices") await query.promise;
      // Forward the original request to the real backend; never manufacture data.
      await route.continue();
    });
    page.on("response", (response) => {
      if (response.request().method() === "POST")
        completed.push(response.request().postDataJSON()?.operationName);
    });
    await page.goto("");
    const header = page.getByTestId("header");
    const title = page.getByTestId("invoicesTitle");
    const status = page.getByTestId("invoice-content-status");
    await expect(header).toBeVisible();
    await expect(title).toBeVisible();
    await expect(status).toContainText("Preparing demo invoices…");
    await expect(
      page.getByRole("progressbar", { name: "Loading invoices", exact: true }),
    ).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const shellNode = await header.elementHandle();
    if (!shellNode) throw new Error("Header must be mounted");
    const titleBefore = await titlePosition(page);
    const firstRow = await status.boundingBox();
    if (!firstRow) throw new Error("Loading row must be visible");
    await expect(cards(page)).toHaveCount(0);
    await expect(page.getByTestId("newInvoiceButton")).toBeDisabled();
    const resetButton = page.getByRole("button", {
      name: "Reset Demo",
      exact: true,
    });
    await expect(resetButton).toBeDisabled();
    await resetButton.evaluate((button) =>
      (button as HTMLButtonElement).click(),
    );
    await page
      .getByTestId("newInvoiceButton")
      .evaluate((button) => (button as HTMLButtonElement).click());
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await expect(page.getByTestId("sun")).toBeVisible();
    await expect(page.getByTestId("container")).toHaveCSS(
      "background-color",
      "rgb(20, 22, 37)",
    );
    await capture(page, info, "initializing-dark");
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await page.waitForTimeout(1500);
    await capture(page, info, "initializing-light");
    expect(operations).toEqual(["ResetDemoData"]);
    expect(completed).toEqual([]);
    await expect(page.getByText("Bill From", { exact: true })).toHaveCount(0);
    const resetReleased = await page.evaluate(() => performance.now());
    const early = await timings(page);
    expect(early.shell).toBeLessThan(resetReleased);
    expect(early.loading).toBeLessThan(resetReleased);
    reset.release();

    await expect(status).toContainText("Loading invoices…");
    await expect
      .poll(() => operations)
      .toEqual(["ResetDemoData", "allInvoices"]);
    await expect(cards(page)).toHaveCount(0);
    await expect(page.getByTestId("newInvoiceButton")).toBeDisabled();
    await expect(title.locator("..")).toContainText("Loading invoices…");
    expect(await titlePosition(page)).toEqual(titleBefore);
    expect(
      await shellNode.evaluate(
        (node) => node === document.querySelector('[data-testid="header"]'),
      ),
    ).toBe(true);
    await page.waitForTimeout(1500);
    await capture(page, info, "loading-invoices");
    const queryReleased = await page.evaluate(() => performance.now());
    query.release();
    await dashboard(page);
    const loaded = await timings(page);
    // Wait for the existing spring animation rather than measuring its overshoot.
    await expect(page.getByTestId("invoice-card").first()).toHaveCSS(
      "transform",
      "none",
    );
    expect(await titlePosition(page)).toEqual(titleBefore);
    const card = await page.getByTestId("invoice-card").first().boundingBox();
    if (!card) throw new Error("Invoice must be visible");
    expect(card.x).toBeCloseTo(firstRow.x, 0);
    expect(card.y).toBeCloseTo(firstRow.y, 0);
    expect(card.width).toBeCloseTo(firstRow.width, 0);
    expect(card.height).toBeCloseTo(firstRow.height, 0);
    await expect(status).toHaveCount(0);
    await expect(page.getByTestId("newInvoiceButton")).toBeEnabled();
    expect(operations.filter((name) => name === "ResetDemoData")).toHaveLength(
      1,
    );
    await noOverflow(page);
    await capture(page, info, "invoices-ready");
    await info.attach("loading-measurements", {
      body: JSON.stringify({
        width,
        ...loaded,
        resetReleased,
        queryReleased,
        shellShiftPx: 0,
        firstRowShiftPx: card.y - firstRow.y,
      }),
      contentType: "application/json",
    });
    console.log({ width, ...loaded, resetReleased, queryReleased });
  });

  test(`responsive backend loads normally and direct invoice reload does not reset at ${width}px`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 1000 });
    await measure(page);
    const resets: string[] = [];
    page.on("request", (request) => {
      if (
        request.method() === "POST" &&
        request.postDataJSON()?.operationName === "ResetDemoData"
      )
        resets.push(request.url());
    });
    await page.goto("");
    await dashboard(page);
    await page.waitForTimeout(700);
    await capture(page, info, "normal-dashboard");
    await info.attach("normal-measurements", {
      body: JSON.stringify({ width, ...(await timings(page)) }),
      contentType: "application/json",
    });
    await openInvoice(page, "RT3080");
    await page.reload();
    await expect(page.getByTestId("invoice-toolbar")).toBeVisible();
    expect(resets).toHaveLength(1);
    await noOverflow(page);
  });
}
