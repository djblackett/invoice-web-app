import type { Locator, Page, TestInfo } from "@playwright/test";
import { visitorTest, expect } from "../fixtures/base";
import {
  boot,
  cards,
  createInvoice,
  dashboard,
  noOverflow,
  operation,
  result,
} from "../helpers/invoice";

const test = visitorTest.extend<{ runtimeHealth: undefined }>({
  runtimeHealth: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await use(undefined);
      expect(
        errors,
        "No uncaught browser errors, including controlled failures",
      ).toEqual([]);
    },
    { auto: true },
  ],
});

async function elementBounds(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("Expected a visible element");
  return box;
}

function viewport(page: Page) {
  const size = page.viewportSize();
  if (!size) throw new Error("Expected a fixed viewport");
  return size;
}

async function capture(page: Page, testInfo: TestInfo, name: string) {
  await testInfo.attach(name, {
    body: await page.screenshot({ fullPage: true }),
    contentType: "image/png",
  });
}

function intersects(a: DOMRect, b: DOMRect) {
  return a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
}

async function styledToast(page: Page, text: string, mode: string) {
  const toast = page.locator(".Toastify__toast");
  await expect(toast).toHaveCount(1);
  await expect(toast).toContainText(text);
  await expect(toast).toHaveClass(new RegExp(`Toastify__toast-theme--${mode}`));
  await expect(toast).toHaveCSS("display", "flex");
  await expect(toast).toHaveCSS("font-size", "14px");
  // Wait for the enter animation so measured bounds reflect the final position.
  await expect(toast).toHaveCSS("animation-name", "none");
  const container = page.locator(".Toastify__toast-container");
  await expect(container).toHaveCSS("position", "fixed");
  await expect(
    page.locator("#container .Toastify__toast-container"),
  ).toHaveCount(0);
  await expect(toast.locator(".Toastify__toast-icon")).toHaveCSS(
    "width",
    "20px",
  );
  await expect(toast.locator(".Toastify__toast-icon svg")).toHaveCSS(
    "height",
    "20px",
  );
  await expect(toast.getByRole("button", { name: "close" })).toBeVisible();
  await expect(toast).toHaveCSS(
    "background-color",
    mode === "dark" ? "rgb(30, 33, 57)" : "rgb(255, 255, 255)",
  );
  await expect(toast.getByRole("button", { name: "close" })).toHaveCSS(
    "color",
    mode === "dark" ? "rgb(255, 255, 255)" : "rgb(17, 21, 23)",
  );
  await expect(toast).toHaveCSS(
    "color",
    mode === "dark" ? "rgb(255, 255, 255)" : "rgb(17, 21, 23)",
  );
  const bounds = await elementBounds(toast);
  expect(bounds.width).toBe(320);
  expect(bounds.height).toBeGreaterThanOrEqual(64);
  expect(bounds.height).toBeLessThanOrEqual(88);
  expect(bounds.x + bounds.width).toBe(viewport(page).width - 16);
  const rect = {
    ...bounds,
    right: bounds.x + bounds.width,
    bottom: bounds.y + bounds.height,
  } as DOMRect;
  for (const control of [
    page.getByTestId("header"),
    page.getByTestId("newInvoiceButton"),
    page.getByTestId("filterButton"),
    page.getByRole("button", { name: "Save", exact: true }),
    page.getByRole("button", { name: "Mark as Paid", exact: true }),
  ]) {
    if (!(await control.isVisible())) continue;
    const box = await elementBounds(control);
    expect(
      intersects(rect, {
        ...box,
        right: box.x + box.width,
        bottom: box.y + box.height,
      } as DOMRect),
    ).toBe(false);
  }
  await noOverflow(page);
  return toast;
}

async function dismissed(page: Page, toast: Locator) {
  await page.mouse.move(0, viewport(page).height - 1);
  await expect(toast).toHaveCount(0, { timeout: 6500 });
}

for (const width of [1440, 768, 390]) {
  for (const mode of ["light", "dark"]) {
    test.describe(`${width}px ${mode}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height: 1000 });
        await page.addInitScript(
          (theme) => localStorage.setItem("theme", theme),
          mode,
        );
        const fontResponse = page.waitForResponse(
          (response) =>
            new URL(response.url()).pathname ===
            "/invoice-web-app/assets/LeagueSpartan-Regular.ttf",
        );
        await boot(page);
        expect((await fontResponse).status()).toBe(200);
        await page.evaluate(() => document.fonts.ready);
      });

      test("initial bundle styles reset success and controlled failure without shifting the dashboard", async ({
        page,
      }, testInfo) => {
        // A local installed font must not hide an incorrect deployed asset URL.
        expect(
          await page.evaluate(() =>
            [...document.fonts].some(
              (face) =>
                face.family === "League Spartan" && face.status === "loaded",
            ),
          ),
        ).toBe(true);
        const title = page.getByTestId("invoicesTitle");
        const before = await title.boundingBox();
        const firstCard = await cards(page).first().boundingBox();
        const header = await elementBounds(page.getByTestId("header"));
        expect(header.y).toBe(0);
        for (const control of [
          page.getByRole("button", { name: "Reset Demo", exact: true }),
          page.getByRole("button", { name: "Logout", exact: true }),
          page.getByTestId("avatar"),
        ]) {
          const box = await elementBounds(control);
          expect(box.y).toBeGreaterThanOrEqual(0);
          expect(box.y + box.height).toBeLessThanOrEqual(
            header.y + header.height,
          );
          expect(box.x).toBeGreaterThanOrEqual(0);
          expect(box.x + box.width).toBeLessThanOrEqual(
            header.x + header.width,
          );
        }
        await capture(page, testInfo, "initial-dashboard");
        await page
          .getByRole("button", { name: "Reset Demo", exact: true })
          .click();
        let toast = await styledToast(page, "Demo invoices restored", mode);
        await dashboard(page);
        expect(await title.boundingBox()).toEqual(before);
        expect(await cards(page).first().boundingBox()).toEqual(firstCard);
        await capture(page, testInfo, "reset-success");
        // Active notifications follow a live theme change too.
        await page.getByRole("button", { name: "Toggle dark mode" }).click();
        await expect(toast).toHaveCSS(
          "background-color",
          mode === "light" ? "rgb(30, 33, 57)" : "rgb(255, 255, 255)",
        );
        await page.getByRole("button", { name: "Toggle dark mode" }).click();
        await dismissed(page, toast);
        expect(await title.boundingBox()).toEqual(before);

        const api = process.env.E2E_API_URL;
        if (!api || new URL(api).hostname !== "127.0.0.1")
          throw new Error("Disposable local API required");
        await page.route(`${api}/`, async (route) => {
          if (route.request().postDataJSON()?.operationName === "ResetDemoData")
            await route.abort("failed");
          else await route.continue();
        });
        await page
          .getByRole("button", { name: "Reset Demo", exact: true })
          .click();
        toast = await styledToast(
          page,
          "Demo could not be reset. Please try again.",
          mode,
        );
        await capture(page, testInfo, "reset-failure");
        expect(await title.boundingBox()).toEqual(before);
        expect(await cards(page).first().boundingBox()).toEqual(firstCard);
        await dismissed(page, toast);
        await page.unroute(`${api}/`);
        await dashboard(page);
      });

      test("invoice form, payment and deletion notifications retain compact styling", async ({
        page,
      }, testInfo) => {
        await page.getByTestId("newInvoiceButton").click();
        await page.locator('input[name="clientEmail"]').fill("invalid-email");
        await expect(
          page.getByText("Invalid email", { exact: true }),
        ).toBeVisible();
        await page.getByTestId("saveDraft").click();
        let toast = await styledToast(
          page,
          "Please fix the errors before saving as draft",
          mode,
        );
        await capture(page, testInfo, "creation-validation");
        await dismissed(page, toast);
        await page
          .getByRole("button", { name: "Discard", exact: true })
          .click();
        const id = await createInvoice(page);
        // Successful creation/deletion currently use navigation, with no success toast.
        await expect(page.locator(".Toastify__toast")).toHaveCount(0);
        await page
          .getByRole("button", { name: "Mark as Paid", exact: true })
          .click();
        toast = await styledToast(page, "Invoice paid!", mode);
        await capture(page, testInfo, "invoice-paid");
        await dismissed(page, toast);
        const api = process.env.E2E_API_URL;
        if (!api || new URL(api).hostname !== "127.0.0.1")
          throw new Error("Disposable local API required");
        await page.route(`${api}/`, async (route) => {
          if (
            route.request().postDataJSON()?.operationName === "RemoveInvoice"
          ) {
            await route.fulfill({
              json: {
                errors: [{ message: "Controlled local deletion failure" }],
              },
            });
          } else await route.continue();
        });
        await page
          .getByRole("button", { name: "delete-button", exact: true })
          .click();
        await page
          .getByRole("button", { name: "delete-button", exact: true })
          .last()
          .click();
        toast = await styledToast(page, "An error occurred!", mode);
        await capture(page, testInfo, "deletion-failure");
        await dismissed(page, toast);
        await page.unroute(`${api}/`);
        const removed = operation(page, "RemoveInvoice");
        await page
          .getByRole("button", { name: "delete-button", exact: true })
          .last()
          .click();
        expect((await result(await removed)).removeInvoice.acknowledged).toBe(
          true,
        );
        await dashboard(page);
        await expect(cards(page).filter({ hasText: id })).toHaveCount(0);
        await expect(page.locator(".Toastify__toast")).toHaveCount(0);
      });
    });
  }
}
