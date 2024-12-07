// @ts-check
// import renderer from "react-test-renderer";
import { test, expect } from "@playwright/test";
import { BASE_URL } from "../config";
// import NewInvoice from "../src/pages/NewInvoice";

test.skip("New invoice page is rendered", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByTestId("newInvoiceButton").click();

    const newInvoicePage = page.getByTestId("newInvoicePage");

    await expect(newInvoicePage).toContainText("New Invoice");
    await expect(newInvoicePage).toContainText("Bill From");
    await expect(newInvoicePage).toContainText("Street Address");
    await expect(newInvoicePage).toContainText("Bill To");
    await expect(newInvoicePage).toContainText("City");
    await expect(newInvoicePage).toContainText("Post Code");
    await expect(newInvoicePage).toContainText("Country");
    await expect(newInvoicePage).toContainText("Client's Name");
    await expect(newInvoicePage).toContainText("Client's Email");
    await expect(newInvoicePage).toContainText("Street Address");
    await expect(newInvoicePage).toContainText("City");
    await expect(newInvoicePage).toContainText("Country");
    await expect(newInvoicePage).toContainText("Invoice Date");
    await expect(newInvoicePage).toContainText("Payment Terms");
    await expect(newInvoicePage).toContainText("Project Description");
    await expect(newInvoicePage).toContainText("Item List");
    await expect(newInvoicePage).toContainText("Item Name");
    await expect(newInvoicePage).toContainText("Qty.");
    await expect(newInvoicePage).toContainText("Price");
    await expect(newInvoicePage).toContainText("Total");
    await expect(newInvoicePage).toContainText(/Add new item/i);
    await expect(newInvoicePage).toContainText("Discard");
    await expect(newInvoicePage).toContainText(/Save as draft/i);
    await expect(newInvoicePage).toContainText("Save & Send");
});




// it("New invoice form renders correctly", () => {

//   const tree = renderer
//     .create(<NewInvoice
//       isNewOpen
//       setIsNewOpen={jest.fn()}
//       padding="0px"
//       setPadding={jest.fn()} />)
//     .toJSON();
//   expect(tree).toMatchSnapshot();
// });
