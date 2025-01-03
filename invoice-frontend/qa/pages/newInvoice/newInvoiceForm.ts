import { Page, Locator } from "@playwright/test";

export class NewInvoiceForm {
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

  constructor(page: Page) {
    this.newInvoiceButton = page
      .getByTestId("newInvoiceButton")
      .getByText("Invoice");
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

  async selectPaymentTerms(paymentTerms: string) {
    await this.paymentTerms.click();
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

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async clickSaveAsDraftButton() {
    await this.saveAsDraftButton.click();
  }
}

/*
await page.locator('input[name="streetAddress"]').click();
  await page.locator('input[name="streetAddress"]').click();
  await page.locator('input[name="streetAddress"]').fill('1234 ');
  await page.locator('input[name="streetAddress"]').press('Shift+CapsLock');
  await page.locator('input[name="streetAddress"]').fill('1234 mAIN');
  await page.locator('input[name="streetAddress"]').press('CapsLock');
  await page.locator('input[name="streetAddress"]').fill('1234 Main Street');
  await page.locator('input[name="city"]').click();
  await page.locator('input[name="city"]').fill('Halifax');
  await page.locator('input[name="postalCode"]').click();
  await page.locator('input[name="postalCode"]').fill('B2L7D9');
  await page.locator('input[name="country"]').click();
  await page.locator('input[name="country"]').fill('Canada');
  await page.locator('input[name="clientName"]').click();
  await page.locator('input[name="clientName"]').fill('Jack Sparrow');
  await page.locator('input[name="clientEmail"]').click();
  await page.locator('input[name="clientEmail"]').fill('sparrow-jack@piratemail.yoho');
  await page.locator('input[name="clientStreetAddress"]').click();
  await page.locator('input[name="clientStreetAddress"]').fill('23 Rusty Bucket Lane');
  await page.locator('input[name="clientCity"]').click();
  await page.locator('input[name="clientCity"]').fill('OpenSea');
  await page.locator('input[name="clientPostalCode"]').click();
  await page.locator('input[name="clientPostalCode"]').fill('H0H0H0');
  await page.locator('input[name="clientCountry"]').click();
  await page.locator('input[name="clientCountry"]').fill('Canada');
  await page.getByTestId('invoiceDate').click();
  await page.getByLabel('Choose Thursday, January 30th,').click();
  await page.locator('div').filter({ hasText: /^Net 1 Day$/ }).click();
  await page.getByRole('button', { name: 'Net 14 Days' }).click();
  await page.locator('input[name="projectDescription"]').click();
  await page.locator('input[name="projectDescription"]').fill('Purchase treasure maps');
  await page.getByRole('button', { name: '+ Add New Item' }).click();
  await page.getByPlaceholder('Item name').click();
  await page.getByPlaceholder('Item name').fill('Large Treasure Map');
  await page.getByPlaceholder('0', { exact: true }).click();
  await page.getByPlaceholder('0', { exact: true }).click();
  await page.getByPlaceholder('0', { exact: true }).fill('3');
  await page.getByPlaceholder('0.00').click();
  await page.getByPlaceholder('0.00').fill('199.96');
  await page.getByPlaceholder('Item name').click();
  await page.getByPlaceholder('Item name').fill('Large Treasure Map3');
  await page.getByRole('button', { name: 'Save', exact: true }).click();

  */
