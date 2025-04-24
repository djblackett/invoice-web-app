import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "../testUtils";
import { NewInvoiceProvider } from "@/features/invoices/forms/NewInvoiceContextProvider";
import NewInvoice from "@/features/invoices/pages/NewInvoice";
import { prettyDOM } from "@testing-library/react";
// import { logTestingPlaygroundURL } from "@testing-library/react";

// one shared clean-up for *all* describes
afterEach(() => {
  cleanup(); // unmount React trees
  // vi.resetModules(); // drop cached modules (incl. your store)
  cleanup();
  vi.restoreAllMocks(); // reset mocks to original implementation
  vi.unstubAllEnvs(); // revert NODE_ENV stub
});

describe("First integration test", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
    render(
      <NewInvoiceProvider
        initialState={{ isNewInvoiceOpen: true }}
        key={crypto.randomUUID()} // forces remount if anything slips through
      >
        <NewInvoice />
      </NewInvoiceProvider>,
    );
  });

  it("should render New Invoice title in the new invoice form", async () => {
    console.log("My printed DOM:", prettyDOM(document.body));
    // logTestingPlaygroundURL();
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
  beforeEach(() => {
    render(
      <NewInvoiceProvider initialState={{ isNewInvoiceOpen: true }}>
        <NewInvoice />
      </NewInvoiceProvider>,
    );
  });

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

  it("should close the new invoice form when isNewInvoiceOpen is false", async () => {
    render(
      <NewInvoiceProvider initialState={{ isNewInvoiceOpen: false }}>
        <NewInvoice />
      </NewInvoiceProvider>,
    );
    const newInvoiceForm = screen.queryByTestId("newInvoicePage");
    expect(newInvoiceForm).not.toBeInTheDocument();
  });
});
