import { expect, test } from "../fixtures/base";
import {
  createExampleInvoice,
  NewInvoiceForm,
} from "../pages/newInvoice/newInvoiceForm";

import { TEST_BASE_URL } from "../../global-setup";

test("Should create a new invoice and be visible in invoices list", async ({
  page,
}) => {
  const newInvoiceForm = new NewInvoiceForm(page);

  // Navigate to the invoice page if not already there
  await page.goto(`${TEST_BASE_URL}#/invoices`);
  await page.waitForLoadState("networkidle");

  await createExampleInvoice(newInvoiceForm);

  // to check if the newInvoice window closed
  await (await newInvoiceForm.getBillFromText()).waitFor({ state: "hidden" });

  expect(await newInvoiceForm.getBillFromText()).toBeHidden();

  await page.getByText("Jack Sparrow").waitFor({ state: "visible" });
  await expect(page.getByText("Jack Sparrow")).toBeVisible();

  await page.getByRole("link", { name: "Jack Sparrow" }).click();
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete" }).nth(1).click();
});

// test.skip("create an example invoice to to use with playwright codegen", async ({
//   page,
// }) => {
//   const newInvoiceForm = new NewInvoiceForm(page);

//   // Navigate to the invoice page if not already there
//   await page.goto(
//     process.env.NODE_ENV === "CI"
//       ? "https://localhost:4173/invoice-web-app/"
//       : "https://localhost:5173/invoice-web-app/#/invoices",
//   );
//   await page.waitForLoadState("networkidle");

//   await createExampleInvoice(newInvoiceForm);
// });
