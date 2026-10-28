import { test, expect } from "../fixtures/base";
import { boot, dashboard, noOverflow, openInvoice } from "../helpers/invoice";
import { refillAllocations } from "../helpers/sessions";

test("a phone gets a workspace, readable controls and no horizontal scroll", async ({
  page,
}) => {
  refillAllocations();
  await boot(page);
  await dashboard(page);
  await expect(page.getByTestId("demo-workspace-notice")).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset Demo" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Logout", exact: true }),
  ).toBeVisible();
  await noOverflow(page);
  await openInvoice(page, "RT3080");
  await noOverflow(page);
});
