import dotenv from "dotenv";
import { InvoiceMainPage } from "./qa/pages/invoices/invoice-main-page";
import { chromium, request } from "@playwright/test";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEST_LOGIN = process.env.TEST_LOGIN;
const TEST_PASSWORD = process.env.TEST_PASSWORD;
export const TEST_BASE_URL = process.env.TEST_BASE_URL || "";
const GRAPHQL_ENDPOINT = `${process.env.VITE_BACKEND_URL}`;
// const GRAPHQL_ENDPOINT = "./graphql";
const TEST_ID = process.env.TEST_ID || "auth0|6773303ad84a96d7bc0329b3";

console.log("GraphQL Endpoint:", GRAPHQL_ENDPOINT);

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

  // await invoiceMainPage.page.waitForURL(`${TEST_BASE_URL}#/login`);
  // await page.waitForFunction(() => window.location.hash === "#/login");

  await invoiceMainPage.welcomePage.clickLoginButton();
  await invoiceMainPage.page.waitForLoadState("networkidle");

  if (process.env.NODE_ENV === "CI") {
    await page.screenshot({ path: "before-login-screenshot.png" });
  }

  await invoiceMainPage.page.getByLabel("Email address").fill(TEST_LOGIN);
  await invoiceMainPage.page.getByLabel("Password").fill(TEST_PASSWORD);
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

  // Read the state.json file and extract the token to use in the deleteAllInvoices API request
  const stateFilePath = path.join(__dirname, "state.json");
  const state = JSON.parse(fs.readFileSync(stateFilePath, "utf8"));

  const origin = state.origins.find(
    (o: {
      origin: string;
      localStorage: { name: string; value: string }[];
    }) => {
      return [
        "https://invoice-web-app",
        "https://frontend-dev:5173",
        "https://localhost:5173",
      ].includes(o.origin);
    },
  );

  if (!origin) {
    throw new Error("Origin not found in state.json");
  }

  const tokenItem = origin.localStorage.find(
    (item: { name: string; value: string }) =>
      item.name.includes("::openid profile email offline_access"),
  );

  if (!tokenItem) {
    throw new Error("Token not found in localStorage of state.json");
  }

  const tokenData = JSON.parse(tokenItem.value);

  const accessToken = tokenData.body?.access_token;
  if (!accessToken) {
    throw new Error("access_token not found in token data");
  }

  await clearDatabase(accessToken);

  await browser.close();
};

export default globalSetup;

async function clearDatabase(authToken: string) {
  const apiRequest = await request.newContext({ ignoreHTTPSErrors: true });
  const response = await apiRequest.post(GRAPHQL_ENDPOINT, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`, // Use the extracted token
    },
    data: {
      query: `
     mutation DeleteAllInvoices {
          deleteAllInvoices {
            acknowledged
          }
        }
      `,
    },
  });

  console.log("Response:", response);

  if (!response.ok()) {
    throw new Error(`Failed to delete invoices: ${await response.text()}`);
  }

  const result = await response.json();
  console.log("json:", result);
  console.log("GraphQL Response:", result);
}
