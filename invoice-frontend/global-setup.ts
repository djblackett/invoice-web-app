import dotenv from "dotenv";
import { InvoiceMainPage } from "./qa/pages/invoices/invoice-main-page";
import { chromium } from "@playwright/test";

dotenv.config();

const TEST_LOGIN = process.env.TEST_LOGIN;
const TEST_PASSWORD = process.env.TEST_PASSWORD;
export const TEST_BASE_URL = process.env.TEST_BASE_URL || "";

if (!TEST_LOGIN || !TEST_PASSWORD) {
  throw new Error("Please provide login and password");
}

if (!TEST_BASE_URL) {
  throw new Error("Please provide TEST_BASE_URL");
}

const globalSetup = async ({ config }) => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  const invoiceMainPage = new InvoiceMainPage(page);
  await invoiceMainPage.gotoPage();

  await invoiceMainPage.page.waitForURL(`${TEST_BASE_URL}#/login`);
  await invoiceMainPage.welcomePage.clickLoginButton();
  await invoiceMainPage.page.waitForLoadState("networkidle");

  await page.screenshot({ path: "before-login-screenshot.png" });
  await invoiceMainPage.page.getByLabel("Email address").fill(TEST_LOGIN);
  await invoiceMainPage.page.getByLabel("Password").fill(TEST_PASSWORD);
  await invoiceMainPage.page
    .getByRole("button", { name: "Continue", exact: true })
    .click();

  await invoiceMainPage.page.waitForLoadState("networkidle");
  await context.storageState({ path: "state.json" });

  await browser.close();
};

export default globalSetup;
