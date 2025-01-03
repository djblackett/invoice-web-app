import { expect, test } from "../fixtures/base";
// import "@testing-library/jest-dom";
test("should display welcome message", async ({ invoiceMainPage }) => {
  //   const welcomeTextLocator = await invoiceMainPage.welcomePage.getWelcomeText();
  //   await welcomeTextLocator.waitFor({ state: "attached", timeout: 5000 });
  //   const welcomeText = await welcomeTextLocator.textContent();
  //   console.log("Welcome text:", welcomeText);
  // await expect(invoiceMainPage.welcomePage.getWelcomeText()).toBeVisible();
  //   (
  //     "Please login to view your invoices",
  //   );
  //   //toContain(
  //     "Please login to view your invoices",
  //   );
});

test("should navigate to home page", async ({ invoiceMainPage }) => {
  await invoiceMainPage.header.clickLogoButton();

  expect(await invoiceMainPage.welcomePage.getWelcomeText()).toBeTruthy();
});

test("avatar should be visible", async ({ invoiceMainPage }) => {
  await expect(invoiceMainPage.header.avatar).toBeVisible();
});

test.skip("should change theme button to dark mode", async ({
  invoiceMainPage,
}) => {
  await invoiceMainPage.header.clickThemeButton();
  const sun = await invoiceMainPage.page.getByTestId("sun").locator("path");

  expect(sun).toBeVisible();
});
