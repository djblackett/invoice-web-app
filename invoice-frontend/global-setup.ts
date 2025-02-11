import dotenv from "dotenv";
dotenv.config();
import { InvoiceMainPage } from "./qa/pages/invoices/invoice-main-page";
import { chromium, request } from "@playwright/test";

const TEST_LOGIN = process.env.TEST_LOGIN;
const TEST_PASSWORD = process.env.TEST_PASSWORD;
export const TEST_BASE_URL = process.env.TEST_BASE_URL;

if (!TEST_LOGIN) {
  throw new Error("Please provide TEST_LOGIN");
}

if (!TEST_PASSWORD) {
  throw new Error("Please provide TEST_PASSWORD");
}

if (!TEST_BASE_URL) {
  throw new Error("Please provide TEST_BASE_URL");
}

async function globalSetup({ config }) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: TEST_BASE_URL,
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  const invoiceMainPage = new InvoiceMainPage(page);
  await invoiceMainPage.gotoPage();

  // await invoiceMainPage.page.waitForURL(`${TEST_BASE_URL}#/login`);
  // await page.waitForFunction(() => window.location.hash === "#/login");

  await invoiceMainPage.welcomePage.clickLoginButton();
  await invoiceMainPage.page.waitForLoadState("networkidle");

  if (process.env.NODE_ENV === "CI") {
    await page.screenshot({ path: "before-login-screenshot.png" });
  }

  await invoiceMainPage.page.getByLabel("Email address").fill(TEST_LOGIN!);
  await invoiceMainPage.page.getByLabel("Password").fill(TEST_PASSWORD!);
  await invoiceMainPage.page
    .getByRole("button", {
      name: "Continue",
      exact: true,
    })
    .click();

  await invoiceMainPage.page.waitForLoadState("networkidle");

  // set the auth key in the local storage so that the app thinks we are logged in
  await context.storageState({ path: "state.json" });

  await invoiceMainPage.page.waitForTimeout(2000);

  await clearDatabase();

  await browser.close();
}

export default globalSetup;

async function clearDatabase() {
  const apiRequest = await request.newContext({ ignoreHTTPSErrors: true });
  const endpoint =
    process.env.VITE_BACKEND_URL?.replace("/graphql", "") + "/test-setup";
  console.log("Endpoint:", endpoint);
  const response = await apiRequest.get(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("Response:", response);
  if (!response.ok()) {
    throw new Error(`Failed to delete invoices: ${await response.text()}`);
  }
  console.log("Response:", response);
}
