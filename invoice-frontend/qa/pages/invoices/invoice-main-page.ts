import { expect, Page } from "@playwright/test";
import BasePage from "../base/base-page";
import { WelcomePage } from "./welcome-page";
import { Header } from "./header";
import AxeBuilder from "@axe-core/playwright";
import { TEST_BASE_URL } from "../../../global-setup";

export class InvoiceMainPage extends BasePage {
  readonly welcomePage: WelcomePage;
  readonly header: Header;

  constructor(page: Page) {
    super(page);
    this.welcomePage = new WelcomePage(page);
    this.header = new Header(page);
  }

  async gotoPage() {
    await this.navigateTo(TEST_BASE_URL as string);
  }

  public async runAccessibilityTest(): Promise<void> {
    const accessibilityScanResults = await new AxeBuilder({
      page: this.page,
    }).analyze();

    accessibilityScanResults.violations.forEach((violation) => {
      console.log(violation.description);
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  }
}
