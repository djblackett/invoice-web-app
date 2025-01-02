import { Page } from "@playwright/test";

export default abstract class BasePage {
  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }
}
