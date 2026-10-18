import { test, expect } from "@playwright/test";

test("demo-disabled deployment has coherent anonymous entry and no invoice access", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("");
  await expect(page.getByTestId("welcome-text")).toHaveText(
    "Please login to view your invoices",
  );
  await expect(page.getByTestId("demo-login-button")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Reset Demo" })).toHaveCount(0);
  await expect(page.getByTestId("login-button")).toBeDisabled();
  await expect(
    page.getByText("Account sign-in is not configured for this deployment."),
  ).toBeVisible();
  await page.goto("#/invoices");
  await expect(page.getByTestId("welcome-text")).toBeVisible();
  await expect(page.locator('a[href*="/invoices/"]')).toHaveCount(0);
  const apiURL = process.env.E2E_DISABLED_API_URL;
  if (!apiURL)
    throw new Error("Run npm run test:e2e to provision isolated services");
  const response = await request.post(apiURL, {
    headers: { authorization: "Bearer demo-token" },
    data: { query: "query { allInvoices { id } }" },
  });
  const body = await response.json();
  expect(body.errors).toBeDefined();
  expect(body.data?.allInvoices).toBeFalsy();
  expect(errors).toEqual([]);
});
