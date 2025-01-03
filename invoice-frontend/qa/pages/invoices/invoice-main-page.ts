import { Locator, Page } from "@playwright/test";
import BasePage from "../base/base-page";
import { WelcomePage } from "./welcome-page";
import { Header } from "./header";

export class InvoiceMainPage extends BasePage {
  readonly welcomePage: WelcomePage;
  readonly header: Header;

  constructor(page: Page) {
    super(page);
    this.welcomePage = new WelcomePage(page);
    this.header = new Header(page);
  }

  async gotoPage() {
    await this.navigateTo(
      process.env.NODE_ENV === "CI"
        ? "https://localhost:4173/invoice-web-app/"
        : "https://localhost:5173/invoice-web-app/",
    );
  }
}
