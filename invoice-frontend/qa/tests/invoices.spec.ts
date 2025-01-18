import { expect, test } from "../fixtures/base";

// Testing the unauthenticated welcome page
test.use({ storageState: { cookies: [], origins: [] } });

test("should display welcome message", async ({ invoiceMainPage }) => {
  const welcomeTextLocator = await invoiceMainPage.welcomePage.getWelcomeText();
  await expect(welcomeTextLocator).toHaveText(
    "Please login to view your invoices",
    { timeout: 5000 },
  );
});

test("should navigate to home page", async ({ invoiceMainPage }) => {
  await invoiceMainPage.header.clickLogoButton();

  expect(await invoiceMainPage.welcomePage.getWelcomeText()).toBeTruthy();
});

test("avatar should be visible", async ({ invoiceMainPage }) => {
  await expect(invoiceMainPage.header.avatar).toBeVisible();
});

test("should change theme button to dark mode", async ({ invoiceMainPage }) => {
  await invoiceMainPage.header.clickThemeButton();
  await invoiceMainPage.page.waitForTimeout(1000);
  const sun = invoiceMainPage.page.getByTestId("sun").locator("path");

  await expect(sun).toBeVisible();
});

test("should change theme back to light mode after 2 clicks", async ({
  invoiceMainPage,
}) => {
  await invoiceMainPage.header.clickThemeButton();
  await invoiceMainPage.header.clickThemeButton();
  await invoiceMainPage.page.waitForTimeout(1000);
  const moon = invoiceMainPage.page.getByTestId("moon").locator("path");

  await expect(moon).toBeVisible();
});

test("should display login button", async ({ invoiceMainPage }) => {
  await expect(invoiceMainPage.welcomePage.loginButton).toBeVisible();
});
