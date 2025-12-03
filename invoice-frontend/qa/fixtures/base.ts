import { test as base } from "@playwright/test";

import { InvoiceMainPage } from "../pages/invoices/invoice-main-page";
import { ApiHelper } from "../helpers/api.helper";

type TestFixtures = {
  invoiceMainPage: InvoiceMainPage;
  apiHelper: ApiHelper;
};

export const test = base.extend<TestFixtures>({
  invoiceMainPage: async ({ page }, use) => {
    const invoiceMainPage = new InvoiceMainPage(page);

    await invoiceMainPage.gotoPage();

    await use(invoiceMainPage);
  },

  apiHelper: async ({}, use) => {
    const apiHelper = new ApiHelper();
    await apiHelper.init();

    await use(apiHelper);

    // Cleanup
    await apiHelper.dispose();
  },
});

export { expect } from "@playwright/test";
