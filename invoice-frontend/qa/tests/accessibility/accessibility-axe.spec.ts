import { test } from "../../fixtures/base";

/*  The design specs for this app fail the accessibility requirements 
    for color contrast.  */
test.describe("Accessibility tests for the text editor", () => {
  test.skip("should have no detectable accessibility issues on load", async ({
    invoiceMainPage,
  }) => {
    await invoiceMainPage.runAccessibilityTest();
  });
});
