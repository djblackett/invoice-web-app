import { expect, test } from "../fixtures/base";
import {
  createExampleInvoice,
  findPastDate,
  NewInvoiceForm,
} from "../pages/newInvoice/newInvoiceForm";

import { clearDatabase, TEST_BASE_URL } from "../../global-setup";

test.beforeEach(async () => {
  await clearDatabase();
});
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

test("should select the chosen date in the date picker", async ({ page }) => {
  // Navigate to the invoice page if not already there
  const newInvoiceForm = new NewInvoiceForm(page);
  await page.goto(`${TEST_BASE_URL}#/invoices`);
  await page.waitForLoadState("networkidle");

  await newInvoiceForm.clickNewInvoiceButton();
  const datePicker = await findPastDate(
    newInvoiceForm,
    page,
    "December 2024",
    "Choose Tuesday, December 10th,",
  );
  await expect(await datePicker).toHaveValue("12/10/2024");
  // await expect(await page.getByTestId("visible-date")).toHaveText("12/10/2024");
});
