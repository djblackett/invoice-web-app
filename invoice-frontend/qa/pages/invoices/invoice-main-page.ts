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
    })
      // Exclude the rule that checks for a missing <h1> tag
      // .disableRules("page-has-heading-one")
      .analyze();

    accessibilityScanResults.violations.forEach((violation) => {
      console.log(violation.description);
    });

    // if (accessibilityScanResults.violations.length > 0) {
    //   const formattedViolations = accessibilityScanResults.violations
    //     .map((violation, index) => {
    //       const nodes = violation.nodes
    //         .map((node) => node.target.join(", "))
    //         .join(", ");
    //       return `
    //       ${index + 1}. **${violation.id}** (${violation.impact})
    //          - **Description:** ${violation.description}
    //          - **Help:** ${violation.help} (${violation.helpUrl})
    //          - **Affected Elements:** ${nodes}
    //       `;
    //     })
    //     .join("\n");

    //   throw new Error(
    //     `Accessibility violations found:\n${formattedViolations}`,
    // );
    expect(accessibilityScanResults.violations).toEqual([]);
  }
}
