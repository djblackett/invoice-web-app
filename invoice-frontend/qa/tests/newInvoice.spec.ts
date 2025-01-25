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

test("should select the chosen date in the date picker", async ({ page }) => {
  // Navigate to the invoice page if not already there
  const newInvoiceForm = new NewInvoiceForm(page);
  await page.goto(`${TEST_BASE_URL}#/invoices`);
  await page.waitForLoadState("networkidle");

  await newInvoiceForm.clickNewInvoiceButton();
  const datePicker = newInvoiceForm.invoiceDate;

  await datePicker.click();

  const previousMonthButton = page.getByLabel("Previous Month");

  // todo -fix these selectors
  const monthYearDisplay = page.locator(".react-datepicker__current-month"); // Adjust the selector accordingly
  const specificDate = page.getByLabel("Choose Tuesday, December 10th,"); // Adjust as needed

  const targetMonthYear = "December 2024";
  const maxIterations = 120; // For up to 10 years of navigation (120 months)
  let currentMonthYear = await monthYearDisplay.textContent();
  let iterations = 0;

  if (!currentMonthYear) {
    throw new Error("Failed to retrieve the current month-year display.");
  }

  // Normalize the text by trimming whitespace
  currentMonthYear = currentMonthYear.trim();

  // Loop to navigate to the target month-year
  while (
    (await monthYearDisplay.textContent()) !== targetMonthYear &&
    iterations < maxIterations
  ) {
    await previousMonthButton.click();

    // Wait for the month-year display to update
    await expect(monthYearDisplay)
      .toHaveText(targetMonthYear, { timeout: 5000 })
      .catch(() => {
        // If the expectation fails, continue to the next iteration
      });

    iterations++;
  }

  if (iterations === maxIterations) {
    throw new Error(
      `Failed to navigate to ${targetMonthYear} after ${maxIterations} attempts.`,
    );
  }

  await specificDate.click();
  // await page.getByLabel("Choose Tuesday, December 10th,").click();

  // Check if the date picker is closed
  // 12/10/2024
  // const dateInputField = await page.getByRole("textbox", {
  //   name: "Invoice date",
  // });
  // expect(await dateInputField).toHaveValue("12/10/2024");
  await expect(await datePicker).toHaveValue("12/10/2024");
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
