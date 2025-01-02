import { Locator, Page } from "@playwright/test";

export class Header {
  readonly logo: Locator;
  readonly logoutButton: Locator;
  readonly themeButton: Locator;
  readonly avatar: Locator;

  // todo - what to do with conditional rendering of the theme icon? moon or sun
  constructor(page: Page) {
    this.logo = page.getByTestId("logo");
    this.logoutButton = page.getByTestId("logout-button");
    this.themeButton = page.getByTestId("dark-mode-button");

    this.avatar = page.getByTestId("avatar");
  }

  async clickLogoButton() {
    await this.logo.click();
  }

  async clickLogoutButton() {
    await this.logoutButton.click();
  }

  async clickThemeButton() {
    await this.themeButton.click();
  }

  async clickAvatar() {
    await this.avatar.click();
  }
}
