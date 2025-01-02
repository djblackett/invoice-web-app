import { Page, Locator } from "@playwright/test";

export class WelcomePage {
  private readonly page: Page;
  readonly welcomeText: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeText = page.getByTestId("welcome-text");
    this.loginButton = page.getByTestId("login-button");
  }

  async navigateTo() {
    await this.page.goto("https://localhost:5173/invoices/");
  }

  async getWelcomeText() {
    return this.welcomeText;
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }
}
