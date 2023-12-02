// eslint-disable-next-line import/no-extraneous-dependencies
import {test, expect} from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test("has title", async ({page}) => {
  await page.goto(BASE_URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Frontend Mentor | Invoice app/);
});

test("renders 'Invoices' text", async ({page}) => {
  await page.goto(BASE_URL);
  await expect(page.getByTestId("invoicesTitle")).toHaveText("Invoices");


});

test("filter drop down opens", async ({page}) => {
  await page.goto(BASE_URL);

  await page.getByTestId("filterButton").click();

  await expect(page.getByTestId("filterDropDown")).toContainText("Draft");
  await expect(page.getByTestId("filterDropDown")).toContainText("Pending");
  await expect(page.getByTestId("filterDropDown")).toContainText("Paid");
});
