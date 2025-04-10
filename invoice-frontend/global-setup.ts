import dotenv from "dotenv";
dotenv.config();
import { InvoiceMainPage } from "./qa/pages/invoices/invoice-main-page";
import { chromium, request } from "@playwright/test";
import * as fs from "fs";

const TEST_LOGIN = process.env.TEST_LOGIN;
const TEST_PASSWORD = process.env.TEST_PASSWORD;
export const TEST_BASE_URL = process.env.TEST_BASE_URL;
console.log("VITE_REDIRECT_URI:", process.env.VITE_REDIRECT_URI);

if (!TEST_LOGIN) {
  throw new Error("Please provide TEST_LOGIN");
}

if (!TEST_PASSWORD) {
  throw new Error("Please provide TEST_PASSWORD");
}

if (!TEST_BASE_URL) {
  throw new Error("Please provide TEST_BASE_URL");
}

async function globalSetup() {
  const browser = await chromium.launch({ headless: true });
  if (!TEST_BASE_URL) {
    throw new Error("Please provide TEST_BASE_URL");
  }

  const context = await browser.newContext({
    baseURL: TEST_BASE_URL,
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  const invoiceMainPage = new InvoiceMainPage(page);
  await invoiceMainPage.gotoPage();

  await invoiceMainPage.welcomePage.clickLoginButton();
  await invoiceMainPage.page.waitForLoadState("networkidle");

  if (!TEST_LOGIN) {
    throw new Error("TEST_LOGIN is not defined");
  }
  if (!TEST_PASSWORD) {
    throw new Error("TEST_PASSWORD is not defined");
  }

  if (process.env.NODE_ENV === "CI") {
    await page.screenshot({
      path: "screenshot-login-screen.png",
      fullPage: true,
    });
    const htmlContent = await page.content();

    // Write the content to a file called 'page.html'
    // This is useful for debugging purposes when auth0 config is not working
    fs.writeFileSync("page.html", htmlContent);
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

  // seemed to have race conditions with the storageState, so added a delay
  await invoiceMainPage.page.waitForTimeout(2000);

  await clearDatabase();

  await browser.close();
}

export default globalSetup;

export async function clearDatabase() {
  const apiRequest = await request.newContext({ ignoreHTTPSErrors: true });
  const endpoint =
    process.env.VITE_BACKEND_URL?.replace("/graphql", "") + "/test-setup";
  // console.log("Endpoint:", endpoint);
  const response = await apiRequest.get(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  // console.log("Response:", response);
  if (!response.ok()) {
    throw new Error(`Failed to delete invoices: ${await response.text()}`);
  }
  // console.log("Response:", response);
  console.log("Database cleared");
}
