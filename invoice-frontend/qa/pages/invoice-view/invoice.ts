import { Locator, Page } from "playwright";
import { waitForNetworkIdle } from "../../helpers/test.utils";

class InvoicePage {
  readonly page: Page;
  readonly editButton: Locator;
  readonly cancelButton: Locator;
  readonly deleteButton: Locator;
  readonly deleteButtonSecond: Locator;
  readonly markAsPaidButton: Locator;
  readonly goBackButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editButton = page.getByRole("button", { name: /edit/i });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.deleteButton = page.getByRole("button", { name: "Delete" }).first();
    this.deleteButtonSecond = page
      .getByRole("button", { name: "Delete" })
      .nth(1);
    this.markAsPaidButton = page.getByRole("button", { name: "Mark as Paid" });
    this.goBackButton = page.getByText("Go back");
  }

  /**
   * Clicks the edit button.
   */
  async clickEditButton(): Promise<void> {
    await this.editButton.waitFor({ state: "visible", timeout: 10000 });
    await this.editButton.click();
    // Wait for edit form fields to appear instead of the modal shell (more robust)
    await this.page
      .getByRole("textbox", { name: /client's name/i })
      .waitFor({ state: "visible", timeout: 5000 });
    await waitForNetworkIdle(this.page);
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

  /**
   * Delete invoice completely (opens modal and confirms)
   */
  async deleteInvoice(): Promise<void> {
    await this.clickDeleteButton();
    await this.clickDeleteButtonSecond();
    await waitForNetworkIdle(this.page);
  }

  /**
   * Mark invoice as paid and wait for update
   */
  async markAsPaid(): Promise<void> {
    await this.clickMarkAsPaidButton();
    await waitForNetworkIdle(this.page);
  }
}

export default InvoicePage;
