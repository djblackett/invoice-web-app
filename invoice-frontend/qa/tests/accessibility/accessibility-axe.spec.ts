import { test } from "../../fixtures/base";

test.describe("Accessibility tests for the text editor", () => {
  test.skip("should have no detectable accessibility issues on load", async ({
    invoiceMainPage,
  }) => {
    await invoiceMainPage.runAccessibilityTest();
  });

  //   test.skip("should have no detectable accessibility issues after making text bold", async ({
  //     invoiceMainPage,
  //   }) => {
  //     // await invoiceMainPage.toolbar.boldButton.click();
  //     // await invoiceMainPage.runAccessibilityTest();
  //   });
});
