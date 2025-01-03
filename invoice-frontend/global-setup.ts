import fetch from "node-fetch";
import fs from "fs/promises"; // For saving token or storage state
import dotenv from "dotenv";
import { InvoiceMainPage } from "./qa/pages/invoices/invoice-main-page";
import { chromium } from "@playwright/test";
// dotenv.config();

// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const AUDIENCE = process.env.AUDIENCE;
// const TEST_API_URL = process.env.TEST_API_URL;

// console.log("CLIENT_ID:", CLIENT_ID);
// console.log("CLIENT_SECRET:", CLIENT_SECRET);
// console.log("AUDIENCE:", AUDIENCE);
// console.log("TEST_API_URL:", TEST_API_URL);

// if (!CLIENT_ID || !CLIENT_SECRET || !AUDIENCE || !TEST_API_URL) {
//   console.error("Missing environment variables");
//   process.exit(1);
// }

// const getAuthToken = async () => {
//   const url = TEST_API_URL;

//   const body = {
//     client_id: CLIENT_ID,
//     client_secret: CLIENT_SECRET,
//     audience: AUDIENCE,
//     grant_type: "client_credentials",
//   };

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       throw new Error(`Error: ${response.status} - ${response.statusText}`);
//     }

//     const data: { access_token: string } = await response.json();
//     console.log("Auth Token:", data.access_token); // Log the token for debugging
//     return data.access_token; // Return the access token
//   } catch (error) {
//     console.error("Failed to fetch token:", error.message);
//     process.exit(1); // Exit process if token fetch fails
//   }
// };

const globalSetup = async ({ config }) => {
  // const token = await getAuthToken();
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  const invoiceMainPage = new InvoiceMainPage(page);
  await invoiceMainPage.gotoPage();
  await invoiceMainPage.welcomePage.clickLoginButton();

  await invoiceMainPage.page
    .getByLabel("Email address")
    .fill("djabusiness89@gmail.com");
  await invoiceMainPage.page.getByLabel("Password").fill("T3st!ng123");
  await invoiceMainPage.page
    .getByRole("button", { name: "Continue", exact: true })
    .click();

  if (process.env.NODE_ENV === "CI") {
    await invoiceMainPage.page.waitForURL(
      "https://localhost:4173/invoice-web-app/",
    );
  } else {
    await invoiceMainPage.page.waitForURL(
      "https://localhost:5173/invoice-web-app/",
    );
  }

  await invoiceMainPage.page.waitForLoadState("networkidle");
  await context.storageState({ path: "state.json" });

  await browser.close();

  // Save the token to a file so it can be used in tests
  // await fs.writeFile("authToken.json", JSON.stringify({ token }));
};

export default globalSetup;
