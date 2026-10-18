import { visitorTest as test, expect } from "../fixtures/base";
import { dashboard, cards } from "../helpers/invoice";

test("shows initialization loading, handles a real offline failure, and retries", async ({
  page,
  context,
}, testInfo) => {
  const apiURL = process.env.E2E_API_URL;
  if (!apiURL)
    throw new Error("Run npm run test:e2e to provision isolated services");
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) => failedRequests.push(request.url()));
  let release: () => void = () => {};
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  // Hold only the outgoing reset request to observe loading, then send it to
  // the real backend unchanged. No response or data is manufactured.
  await page.route(`${apiURL}/`, async (route) => {
    if (route.request().postDataJSON()?.operationName === "ResetDemoData")
      await pending;
    await route.continue();
  });
  await page.goto("");
  await expect(page.getByRole("status")).toHaveText("Preparing demo invoices…");
  await expect(cards(page)).toHaveCount(0);
  release();
  await dashboard(page);
  await page.unroute(`${apiURL}/`);
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await expect(page.getByTestId("demo-login-button")).toBeVisible();
  await context.setOffline(true);
  await page.getByTestId("demo-login-button").click();
  await expect(page.getByRole("alert")).toContainText(
    "Demo could not be initialized.",
  );
  await expect(cards(page)).toHaveCount(0);
  await context.setOffline(false);
  await page.getByRole("button", { name: "Retry Demo", exact: true }).click();
  await dashboard(page);
  expect(pageErrors).toEqual([]);
  expect(failedRequests).toEqual([apiURL + "/"]);
  await testInfo.attach("intentional-offline-failure", {
    body: JSON.stringify(failedRequests),
    contentType: "application/json",
  });
});
