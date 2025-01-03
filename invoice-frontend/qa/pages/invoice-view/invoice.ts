import { Locator, Page } from "playwright";

class InvoicePage {
  readonly editButton: Locator;
  readonly cancelButton: Locator;
  readonly deleteButton: Locator;
  readonly deleteButtonSecond: Locator;
  readonly markAsPaidButton: Locator;
  readonly goBackButton: Locator;

  constructor(page: Page) {
    this.editButton = page.getByRole("button", { name: "Edit" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.deleteButton = page.getByRole("button", { name: "Delete" }).first();
    this.deleteButtonSecond = page
      .getByRole("button", { name: "Delete" })
      .nth(1);
    this.markAsPaidButton = page.getByRole("button", { name: "Mark as Paid" });
    this.goBackButton = page.getByText("Go back");
  }

  /**
   * Clicks the Edit button.
   */
  async clickEditButton(): Promise<void> {
    await this.editButton.click();
  }

  /**
   * Clicks the Cancel button.
   */
  async clickCancelButton(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Clicks the first Delete button.
   */
  async clickDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  /**
   * Clicks the second Delete button.
   */
  async clickDeleteButtonSecond(): Promise<void> {
    await this.deleteButtonSecond.click();
  }

  /**
   * Clicks the Mark as Paid button.
   */
  async clickMarkAsPaidButton(): Promise<void> {
    await this.markAsPaidButton.click();
  }

  /**
   * Clicks the Go Back button or link.
   */
  async clickGoBackButton(): Promise<void> {
    await this.goBackButton.click();
  }

  /**
   * Performs a series of actions as per the provided script.
   * This method can be customized based on your test scenario.
   */
  async performActions(): Promise<void> {
    await this.clickEditButton();
    await this.clickCancelButton();
    await this.clickDeleteButton();
    await this.clickCancelButton();
    await this.clickMarkAsPaidButton();
    await this.clickDeleteButton();
    await this.clickDeleteButtonSecond();
    await this.clickGoBackButton();
  }
}

export default InvoicePage;

/*
await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'Mark as Paid' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).nth(1).click();
  await page.getByText('Go back').click();
*/
