import { expect, test } from "../fixtures/base";
import { NewInvoiceForm } from "../pages/newInvoice/newInvoiceForm";

test("Create a new invoice", async ({ page }) => {
  const newInvoiceForm = new NewInvoiceForm(page);

  // Navigate to the invoice page if not already there
  await page.goto(
    process.env.NODE_ENV === "CI"
      ? "https://localhost:4173/invoice-web-app/"
      : "https://localhost:5173/invoice-web-app/",
  );

  // Click the "New Invoice" button
  await newInvoiceForm.clickNewInvoiceButton();

  // Fill in the invoice details
  await newInvoiceForm.fillStreetAddress("1234 Main Street");
  await newInvoiceForm.fillCity("Halifax");
  await newInvoiceForm.fillPostalCode("B2L7D9");
  await newInvoiceForm.fillCountry("Canada");

  // Fill in client details
  await newInvoiceForm.fillClientName("Jack Sparrow");
  await newInvoiceForm.fillClientEmail("sparrow-jack@piratemail.yoho");
  await newInvoiceForm.fillClientStreetAddress("23 Rusty Bucket Lane");
  await newInvoiceForm.fillClientCity("OpenSea");
  await newInvoiceForm.fillClientPostalCode("H0H0H0");
  await newInvoiceForm.fillClientCountry("Canada");

  // Select invoice date
  await newInvoiceForm.clickInvoiceDate();
  await newInvoiceForm.selectInvoiceDate("Thursday, January 30th,");
  await newInvoiceForm.fillDate("2025-01-30");

  // Select payment terms
  await newInvoiceForm.selectPaymentTerms("Net 14 Days");

  // Fill project description
  await newInvoiceForm.fillProjectDescription("Purchase treasure maps");

  // Add first item
  await newInvoiceForm.addItem("Large Treasure Map", 3, 199.96);

  // Add second item
  await newInvoiceForm.addItem("Extra Large Treasure Map", 1, 99.99); // Example values

  // Save the invoice
  await newInvoiceForm.clickSaveButton();

  // to check if the newInvoice window closed
  await (await newInvoiceForm.getBillFromText()).waitFor({ state: "hidden" });

  expect(await newInvoiceForm.getBillFromText()).toBeHidden();

  await page.getByText("Jack Sparrow").waitFor({ state: "visible" });
  await expect(await page.getByText("Jack Sparrow")).toBeVisible();

  await page.getByRole("link", { name: "Jack Sparrow" }).click();
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete" }).nth(1).click();
});
