export const BASE_URL = process.env.CI
  ? "https://localhost:4173/invoice-web-app/"
  : "https://localhost:5173/invoice-web-app/";

import { test as base, expect } from "@playwright/test";

// export the extended `test` object
export const test = base.extend<{ page: void; failOnJSError: boolean }>({
  failOnJSError: [true, { option: true }],
  page: async ({ page, failOnJSError }, use) => {
    const errors: Array<Error> = [];

    page.addListener("pageerror", (error) => {
      errors.push(error);
    });

    await use(page);

    if (failOnJSError) {
      errors.forEach((error) => {
        console.log(error);
      });
      expect(errors).toHaveLength(0);
    }
  },
});

// export Playwright's `expect`
export { expect } from "@playwright/test";
