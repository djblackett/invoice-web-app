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

// Not sure how to test this or even if we should
test("should navigate to login page", async ({ invoiceMainPage }) => {
  // await invoiceMainPage.welcomePage.clickLoginButton();
  // await invoiceMainPage.page.getByLabel("Link to the Auth0 website").waitFor();
  // await invoiceMainPage.page
  //   .getByLabel("Email address")
  //   .fill("djabusiness89@gmail.com");
  // await invoiceMainPage.page.getByLabel("Password").fill("T3st!ng123");
  // await invoiceMainPage.page
  //   .getByRole("button", { name: "Continue", exact: true })
  //   .click();

  // await invoiceMainPage.page.waitForURL(
  //   "https://localhost:5173/invoice-web-app/",
  // );
  // await invoiceMainPage.page.waitForLoadState("networkidle");

  // const button = await invoiceMainPage.page.getByTestId("newInvoiceButton");
  // .waitFor({ state: "attached", timeout: 5000 });

  // await expect(button).toBeVisible({ timeout: 5000 });
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

  expect(await invoiceMainPage.header.themeButton).toBe(true);
});
