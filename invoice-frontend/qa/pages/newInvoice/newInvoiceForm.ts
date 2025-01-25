import { Page, Locator } from "@playwright/test";
import InvoiceItem from "./InvoiceItem";

export class NewInvoiceForm {
  page: Page;
  readonly billFromText: Locator;
  readonly newInvoiceButton: Locator; // technically should be in parent page
  readonly streetAddress: Locator;
  readonly city: Locator;
  readonly postalCode: Locator;
  readonly country: Locator;
  readonly clientName: Locator;
  readonly clientEmail: Locator;
  readonly clientStreetAddress: Locator;
  readonly clientCity: Locator;
  readonly clientPostalCode: Locator;
  readonly clientCountry: Locator;
  readonly invoiceDate: Locator;
  readonly paymentTerms: Locator;
  readonly projectDescription: Locator;
  readonly addItemButton: Locator;
  readonly itemDescription: Locator;
  readonly itemQuantity: Locator; // will need to make this an array or something
  readonly itemPrice: Locator;
  readonly saveButton: Locator;
  readonly saveAsDraftButton: Locator;
  readonly discardButton: Locator;
  readonly itemsContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.billFromText = page.getByText("Bill From");
    this.newInvoiceButton = page.getByTestId("newInvoiceButton");
    this.streetAddress = page.locator('input[name="streetAddress"]');
    this.city = page.locator('input[name="city"]');
    this.postalCode = page.locator('input[name="postalCode"]');
    this.country = page.locator('input[name="country"]');
    this.clientName = page.locator('input[name="clientName"]');
    this.clientEmail = page.locator('input[name="clientEmail"]');
    this.clientStreetAddress = page.locator(
      'input[name="clientStreetAddress"]',
    );
    this.clientCity = page.locator('input[name="clientCity"]');
    this.clientPostalCode = page.locator('input[name="clientPostalCode"]');
    this.clientCountry = page.locator('input[name="clientCountry"]');
    this.invoiceDate = page.getByTestId("invoiceDate");
    this.paymentTerms = page.locator("div").filter({ hasText: /^Net 1 Day$/ });
    this.projectDescription = page.locator('input[name="projectDescription"]');
    this.addItemButton = page.getByRole("button", { name: "+ Add New Item" });
    this.itemDescription = page.getByPlaceholder("Item name");
    this.itemQuantity = page.getByPlaceholder("0", { exact: true });
    this.itemPrice = page.getByPlaceholder("0.00");
    this.saveButton = page.getByRole("button", { name: "Save", exact: true });
    this.saveAsDraftButton = page.getByRole("button", {
      name: "Save as Draft",
      exact: true,
    });
    this.discardButton = page.getByRole("button", { name: "Discard" });
    this.itemsContainer = page.locator('[data-testid="items-container"]');
  }

  async getBillFromText() {
    return this.billFromText;
  }

  async clickNewInvoiceButton() {
    await this.newInvoiceButton.click();
  }

  async fillStreetAddress(streetAddress: string) {
    await this.streetAddress.fill(streetAddress);
  }

  async fillCity(city: string) {
    await this.city.fill(city);
  }

  async fillPostalCode(postalCode: string) {
    await this.postalCode.fill(postalCode);
  }

  async fillCountry(country: string) {
    await this.country.fill(country);
  }

  async fillClientName(clientName: string) {
    await this.clientName.fill(clientName);
  }

  async fillClientEmail(clientEmail: string) {
    await this.clientEmail.fill(clientEmail);
  }

  async fillClientStreetAddress(clientStreetAddress: string) {
    await this.clientStreetAddress.fill(clientStreetAddress);
  }

  async fillClientCity(clientCity: string) {
    await this.clientCity.fill(clientCity);
  }

  async fillClientPostalCode(clientPostalCode: string) {
    await this.clientPostalCode.fill(clientPostalCode);
  }

  async fillClientCountry(clientCountry: string) {
    await this.clientCountry.fill(clientCountry);
  }

  async clickInvoiceDate() {
    await this.invoiceDate.click();
  }

  /**
   * Selects a specific date from the date picker.
   * @param dateText The visible text of the date to select (e.g., 'Thursday, January 30th, 2025')
   */
  async selectInvoiceDate(dateText: string) {
    await this.getDatePickerOption(dateText).click();
  }

  async fillDate(date: string) {
    await this.invoiceDate.fill(date);
  }

  /**
   * Helper method to get a specific date option.
   * Adjust the locator as per your date picker implementation.
   * @param dateText The text of the date option to select
   */
  private getDatePickerOption(dateText: string): Locator {
    return this.page.getByRole("option", { name: `Choose ${dateText}` });
  }

  async selectPaymentTerms(paymentTerms: string) {
    // Update the locator to match the payment term text
    const paymentTermOption = this.page.locator(`text=${paymentTerms}`);
    await paymentTermOption.click({ force: true });
  }

  async fillProjectDescription(projectDescription: string) {
    await this.projectDescription.fill(projectDescription);
  }

  async clickAddItemButton() {
    await this.addItemButton.click();
  }

  async fillItemDescription(itemDescription: string) {
    await this.itemDescription.fill(itemDescription);
  }

  async fillItemQuantity(itemQuantity: number) {
    await this.itemQuantity.fill(itemQuantity.toString());
  }

  async fillItemPrice(itemPrice: number) {
    await this.itemPrice.fill(itemPrice.toString());
  }

  /**
   * Adds a new item with the provided details.
   * @param description Description of the item
   * @param quantity Quantity of the item
   * @param price Price of the item
   */

  async addItem(
    description: string,
    quantity: number,
    price: number,
  ): Promise<void> {
    try {
      await this.clickAddItemButton();

      const newItemLocator = this.itemsContainer
        .locator('[data-testid="invoice-item"]')
        .last();
      await newItemLocator.waitFor({ state: "visible", timeout: 5000 });

      const newItem = new InvoiceItem(newItemLocator);
      await newItem.fillDescription(description);
      await newItem.fillQuantity(quantity);
      await newItem.fillPrice(price);
    } catch (error) {
      throw new Error(`Failed to add item "${description}": ${error}`);
    }
  }

  async addMultipleItems(
    items: { description: string; quantity: number; price: number }[],
  ): Promise<void> {
    for (const item of items) {
      await this.addItem(item.description, item.quantity, item.price);
    }
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async clickSaveAsDraftButton() {
    await this.saveAsDraftButton.click();
  }

  async clickDiscardButton() {
    await this.discardButton.click();
  }
}

export async function createExampleInvoice(newInvoiceForm: NewInvoiceForm) {
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
}
