import dotenv from "dotenv";
import { InvoiceMainPage } from "./qa/pages/invoices/invoice-main-page";
import { chromium } from "@playwright/test";
dotenv.config();

const LOGIN = process.env.LOGIN || "";
const PASSWORD = process.env.PASSWORD || "";

const globalSetup = async ({ config }) => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  const invoiceMainPage = new InvoiceMainPage(page);
  await invoiceMainPage.gotoPage();

  await invoiceMainPage.page.waitForURL(
    "https://localhost:5173/invoice-web-app/#/login",
  );
  await invoiceMainPage.welcomePage.clickLoginButton();

  await invoiceMainPage.page.getByLabel("Email address").fill(LOGIN);
  await invoiceMainPage.page.getByLabel("Password").fill(PASSWORD);
  await invoiceMainPage.page
    .getByRole("button", { name: "Continue", exact: true })
    .click();

  // may be needed for CI - tbd
  if (process.env.NODE_ENV === "CI") {
    await invoiceMainPage.page.waitForURL(
      "https://localhost:4173/invoice-web-app/#/invoices",
    );
  }

  await invoiceMainPage.page.waitForLoadState("networkidle");
  await context.storageState({ path: "state.json" });

  await browser.close();
};

export default globalSetup;
