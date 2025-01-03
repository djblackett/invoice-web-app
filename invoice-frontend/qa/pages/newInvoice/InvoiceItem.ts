import { Locator } from "@playwright/test";

class InvoiceItem {
  readonly itemContainer: Locator;

  constructor(itemLocator: Locator) {
    this.itemContainer = itemLocator;
  }

  async fillDescription(description: string) {
    await this.itemContainer
      .locator('input[placeholder="Item name"]')
      .fill(description);
  }

  async fillQuantity(quantity: number) {
    await this.itemContainer
      .locator('input[placeholder="0"]')
      .fill(quantity.toString());
  }

  async fillPrice(price: number) {
    await this.itemContainer
      .locator('input[placeholder="0.00"]')
      .fill(price.toFixed(2));
  }
}

export default InvoiceItem;
// Usage in NewInvoiceForm
