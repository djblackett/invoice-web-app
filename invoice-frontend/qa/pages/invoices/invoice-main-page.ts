import { expect, Page, Locator } from "@playwright/test";
import BasePage from "../base/base-page";
import { WelcomePage } from "./welcome-page";
import { Header } from "./header";
import AxeBuilder from "@axe-core/playwright";
import { TEST_BASE_URL } from "../../../global-setup";
import { waitForNetworkIdle } from "../../helpers/test.utils";

export class InvoiceMainPage extends BasePage {
  readonly welcomePage: WelcomePage;
  readonly header: Header;
  readonly newInvoiceButton: Locator;
  readonly filterButton: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomePage = new WelcomePage(page);
    this.header = new Header(page);
    this.newInvoiceButton = page.getByTestId("newInvoiceButton");
    this.filterButton = page.getByTestId("filterButton");
  }

  async gotoPage() {
    await this.navigateTo(TEST_BASE_URL as string);
  }

  /**
   * Click on an invoice by client name
   */
  async clickInvoiceByName(clientName: string): Promise<void> {
    await this.page.getByRole("link", { name: clientName }).click();
    await waitForNetworkIdle(this.page);
  }

  /**
   * Get all invoice elements in the list
   */
  getInvoiceElements(): Locator {
    return this.page.locator('[data-testid="invoice-item"]');
  }

  /**
   * Get invoice count in the list
   */
  async getInvoiceCount(): Promise<number> {
    return await this.getInvoiceElements().count();
  }

  /**
   * Check if invoice exists by client name
   */
  async hasInvoice(clientName: string): Promise<boolean> {
    const invoice = this.page.getByText(clientName).first();
    return await invoice.isVisible();
  }

  /**
   * Open new invoice form
   */
  async openNewInvoiceForm(): Promise<void> {
    await this.newInvoiceButton.click();
    await this.page.getByText("Bill From").waitFor({ state: "visible" });
  }

  /**
   * Open filter menu
   */
  async openFilterMenu(): Promise<void> {
    await this.filterButton.click();
  }

  /**
   * Filter invoices by status
   */
  async filterByStatus(status: "Draft" | "Pending" | "Paid"): Promise<void> {
    await this.openFilterMenu();
    const filterOption = this.page.getByTestId(`${status.toLowerCase()}-filter`);
    await filterOption.click();
    await waitForNetworkIdle(this.page);
  }

  /**
   * Clear all filters
   */
  async clearFilters(): Promise<void> {
    // Click filter button to close if open
    const isFilterOpen = await this.page
      .getByTestId("draft-filter")
      .isVisible()
      .catch(() => false);
    if (isFilterOpen) {
      await this.filterButton.click();
    }
  }

  /**
   * Run accessibility test
   */
  public async runAccessibilityTest(): Promise<void> {
    const accessibilityScanResults = await new AxeBuilder({
      page: this.page,
    }).analyze();

    accessibilityScanResults.violations.forEach((violation) => {
      console.log(violation.description);
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  }

  /**
   * Wait for invoices to load
   */
  async waitForInvoicesToLoad(): Promise<void> {
    await waitForNetworkIdle(this.page);
  }
}
