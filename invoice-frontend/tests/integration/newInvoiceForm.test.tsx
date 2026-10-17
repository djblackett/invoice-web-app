import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { act } from "react";
import { cleanup, fireEvent, render, screen, within } from "../testUtils";
import { NewInvoiceProvider } from "@/features/invoices/forms/NewInvoiceContextProvider";
import NewInvoice from "@/features/invoices/pages/NewInvoice";

// Rendering the real lazy form must finish inside async act. Otherwise React 19
// can leave the first render suspended while parallel workers load its modules.
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

async function renderOpenInvoice() {
  await act(async () => {
    // Load the real lazy children before mounting: module transformation can be
    // delayed by other workers, and DateAndPayment suspends the whole form.
    await Promise.all([
      import("@/features/invoices/forms/date/DateAndPayment"),
      import("@/features/invoices/forms/date/ExampleCustomInput"),
      import("@/features/invoices/forms/newInvoice/NewInvoiceBottomMenu"),
    ]);
    render(
      <NewInvoiceProvider initialState={{ isNewInvoiceOpen: true }}>
        <NewInvoice />
      </NewInvoiceProvider>,
    );
  });
}

describe("First integration test", () => {
  beforeEach(renderOpenInvoice);

  it("should render New Invoice title in the new invoice form", async () => {
    const title = await screen.findByRole(
      "heading",
      { name: /new invoice/i },
      { timeout: 3000 }, // wait up to 3 s
    );
    expect(title).toBeInTheDocument();
  });

  it("should render the save button in the new invoice form", async () => {
    const saveButton = await screen.findByText("Save");
    expect(saveButton).toBeInTheDocument();
  });

  it("should render the discard button in the new invoice form", async () => {
    const cancelButton = await screen.findByText("Discard");
    expect(cancelButton).toBeInTheDocument();
  });

  it("should render the save by draft button in the new invoice form", async () => {
    const saveByDraftButton = await screen.findByTestId("saveDraft");
    expect(saveByDraftButton).toBeInTheDocument();
  });
});

describe("NewInvoiceForm - basic DOM elements", () => {
  beforeEach(renderOpenInvoice);

  it("renders all label texts", async () => {
    // Bill From section
    expect(await screen.findByText(/Bill From/)).toBeInTheDocument();
    // "Street Address", "City", "Post Code", "Country" appear twice (Bill From and Bill To)
    expect(screen.getAllByText("Street Address")).toHaveLength(2);
    expect(screen.getAllByText("City")).toHaveLength(2);
    expect(screen.getAllByText("Post Code")).toHaveLength(2);
    expect(screen.getAllByText("Country")).toHaveLength(2);

    // Bill To section
    expect(screen.getByText("Bill To")).toBeInTheDocument();
    expect(screen.getByText("Client's Name")).toBeInTheDocument();
    expect(screen.getByText("Client's Email")).toBeInTheDocument();

    // Other sections
    expect(screen.getByText("Invoice Date")).toBeInTheDocument();
    expect(screen.getByText("Payment Terms")).toBeInTheDocument();
    expect(screen.getByText("Project Description")).toBeInTheDocument();
    expect(screen.getByText("Item List")).toBeInTheDocument();
    // Desktop-only labels for the item list
    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("Qty.")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("renders all input fields", async () => {
    // Bill  inputs (check that there are two of each duplicate label)
    expect(await screen.findAllByLabelText("Street Address")).toHaveLength(2);
    expect(screen.getAllByLabelText("City")).toHaveLength(2);
    expect(screen.getAllByLabelText("Post Code")).toHaveLength(2);
    expect(screen.getAllByLabelText("Country")).toHaveLength(2);

    // Client-specific inputs
    expect(screen.getByLabelText("Client's Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Client's Email")).toBeInTheDocument();

    // Other inputs: Invoice Date and Project Description
    // expect(await screen.findByTestId("visibleDate")).toBeInTheDocument();
    expect(screen.getByLabelText("Project Description")).toBeInTheDocument();
  });

  it("renders item inputs in the invoice item list", async () => {
    expect(await screen.findByPlaceholderText("Item name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0.00")).toBeInTheDocument();
  });

  it("renders payment terms options", async () => {
    // Check that all payment term options are available in the dropdown list.

    const paymentTerms = await screen.findByTestId("dropdownHeader");
    fireEvent.click(paymentTerms);
    expect(screen.getByTestId("Net 1 Day-testID")).toBeInTheDocument();
    expect(screen.getByTestId("Net 7 Days-testID")).toBeInTheDocument();
    expect(screen.getByTestId("Net 14 Days-testID")).toBeInTheDocument();
    expect(screen.getByTestId("Net 30 Days-testID")).toBeInTheDocument();
  });

  it("updates quantity, price and totals on a second item", async () => {
    fireEvent.click(await screen.findByTestId("newItemButton"));
    const rows = screen.getAllByTestId("invoice-item");
    expect(rows).toHaveLength(2);
    const second = within(rows[1]);
    fireEvent.change(second.getByPlaceholderText("0"), {
      target: { value: "3" },
    });
    fireEvent.change(second.getByPlaceholderText("0.00"), {
      target: { value: "12.50" },
    });
    expect(second.getByText("37.50")).toBeInTheDocument();
  });

  it("preserves quantity and price pattern errors on save", async () => {
    fireEvent.change(await screen.findByPlaceholderText("0"), {
      target: { value: "invalid" },
    });
    fireEvent.change(screen.getByPlaceholderText("0.00"), {
      target: { value: "invalid" },
    });
    fireEvent.click(await screen.findByText("Save"));
    expect(
      await screen.findByText("Only numbers are allowed"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "Only numbers are allowed - max 2 decimal places",
      ),
    ).toBeInTheDocument();
  });

  it("should close the new invoice form when isNewInvoiceOpen is false", () => {
    cleanup();
    render(
      <NewInvoiceProvider initialState={{ isNewInvoiceOpen: false }}>
        <NewInvoice />
      </NewInvoiceProvider>,
    );
    const newInvoiceForm = screen.queryByRole("heading", {
      name: /new invoice/i,
    });
    expect(newInvoiceForm).not.toBeInTheDocument();
  });
});
