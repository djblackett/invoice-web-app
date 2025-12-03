import { expect, test } from "../fixtures/base";
import { waitForElementReady } from "../helpers/test.utils";

test.describe("Unauthenticated Welcome Page", () => {
  // Testing the unauthenticated welcome page
  test.use({ storageState: { cookies: [], origins: [] } });

  test("should display welcome message", async ({ invoiceMainPage }) => {
    const welcomeTextLocator =
      await invoiceMainPage.welcomePage.getWelcomeText();
    await expect(welcomeTextLocator).toHaveText(
      "Please login to view your invoices",
      { timeout: 5000 },
    );
  });

  test("should navigate to home page", async ({ invoiceMainPage }) => {
    await invoiceMainPage.header.clickLogoButton();

    const welcomeText = await invoiceMainPage.welcomePage.getWelcomeText();
    await expect(welcomeText).toBeVisible();
  });

  test("avatar should be visible", async ({ invoiceMainPage }) => {
    await expect(invoiceMainPage.header.avatar).toBeVisible();
  });

  test("should display login button", async ({ invoiceMainPage }) => {
    await expect(invoiceMainPage.welcomePage.loginButton).toBeVisible();
  });
});

test.describe("Theme Toggle", () => {
  // Testing the unauthenticated welcome page theme
  test.use({ storageState: { cookies: [], origins: [] } });

  test("should change theme button to dark mode", async ({
    invoiceMainPage,
  }) => {
    await invoiceMainPage.header.clickThemeButton();

    // Wait for sun icon to appear (dark mode indicator)
    const sun = invoiceMainPage.page.getByTestId("sun").locator("path");
    await expect(sun).toBeVisible({ timeout: 5000 });
  });

  test("should change theme back to light mode after 2 clicks", async ({
    invoiceMainPage,
  }) => {
    // First click - switch to dark mode
    await invoiceMainPage.header.clickThemeButton();
    const sun = invoiceMainPage.page.getByTestId("sun").locator("path");
    await expect(sun).toBeVisible({ timeout: 5000 });

    // Second click - switch back to light mode
    await invoiceMainPage.header.clickThemeButton();
    const moon = invoiceMainPage.page.getByTestId("moon").locator("path");
    await expect(moon).toBeVisible({ timeout: 5000 });
  });
});
