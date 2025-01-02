import { test as base } from "@playwright/test";

import { InvoiceMainPage } from "../pages/invoices/invoice-main-page";

export const test = base.extend<{ invoiceMainPage: InvoiceMainPage }>({
  invoiceMainPage: async ({ page }, use) => {
    const invoiceMainPage = new InvoiceMainPage(page);

    await invoiceMainPage.gotoPage();

    await use(invoiceMainPage);
  },
});

export { expect } from "@playwright/test";
