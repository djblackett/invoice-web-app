import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../testUtils";
import AllInvoicesView from "@/features/invoices/components/AllInvoicesView";
import invoices from "../data/invoices";
import { MemoizedAllInvoicesToolbar } from "@/features/invoices/components/AllInvoicesToolbar";
import { NewInvoiceProvider } from "@/features/invoices/forms/NewInvoiceContextProvider";
import NewInvoice from "@/features/invoices/pages/NewInvoice";
import { Suspense } from "react";

describe("First integration test", () => {
  vi.stubEnv("NODE_ENV", "production");

  it("should render the full list of invoices ", () => {
    render(
      <>
        <NewInvoiceProvider>
          <MemoizedAllInvoicesToolbar
            invoiceList={invoices}
            data-testid="invoices-toolbar"
          />
          <Suspense>
            <NewInvoice />
          </Suspense>
        </NewInvoiceProvider>
        {/* <FadeOut className="welcome-text" username={user?.email}></FadeOut> */}
        <AllInvoicesView invoiceList={invoices} width={1200} loading={false} />
      </>,
    );
    const invoicesList = screen.getAllByTestId("invoice-card");
    expect(invoicesList.length).toBe(invoices.length);
  });

  it("should render the loading state", () => {
    render(
      <>
        <NewInvoiceProvider>
          <MemoizedAllInvoicesToolbar
            invoiceList={invoices}
            data-testid="invoices-toolbar"
          />
          <Suspense>
            <NewInvoice />
          </Suspense>
        </NewInvoiceProvider>
        <AllInvoicesView invoiceList={[]} width={1200} loading={true} />
      </>,
    );
    const loadingGrid = screen.getByTestId("grid-loading");
    expect(loadingGrid).toBeInTheDocument();
  });

  it("should render the error state", () => {
    const error = new Error("Test error");
    render(
      <>
        <NewInvoiceProvider>
          <MemoizedAllInvoicesToolbar
            invoiceList={invoices}
            data-testid="invoices-toolbar"
          />
          <Suspense>
            <NewInvoice />
          </Suspense>
        </NewInvoiceProvider>
        <AllInvoicesView
          invoiceList={[]}
          width={1200}
          loading={false}
          error={error}
        />
      </>,
    );
    const errorMessage = screen.getByText("Test error");
    expect(errorMessage).toBeInTheDocument();
  });

  it("should open the new invoice form when isNewInvoiceOpen is true", async () => {
    render(
      <>
        <MemoizedAllInvoicesToolbar
          invoiceList={invoices}
          data-testid="invoices-toolbar"
        />
        <NewInvoiceProvider initialState={{ isNewInvoiceOpen: true }}>
          <NewInvoice />
        </NewInvoiceProvider>
      </>,
    );

    const newInvoiceForm = await screen.findByTestId("newInvoicePage");
    expect(newInvoiceForm).toBeInTheDocument();
  });

  it("should close the new invoice form when isNewInvoiceOpen is false", async () => {
    render(
      <>
        <MemoizedAllInvoicesToolbar
          invoiceList={invoices}
          data-testid="invoices-toolbar"
        />
        <NewInvoiceProvider initialState={{ isNewInvoiceOpen: false }}>
          <NewInvoice />
        </NewInvoiceProvider>
      </>,
    );

    const newInvoiceForm = screen.queryByTestId("newInvoicePage");
    expect(newInvoiceForm).not.toBeInTheDocument();
  });

  it("should render New Invoice title in the new invoice form", async () => {
    render(
      <>
        <NewInvoiceProvider initialState={{ isNewInvoiceOpen: true }}>
          <NewInvoice />
        </NewInvoiceProvider>
      </>,
    );

    const newInvoiceTitle = await screen.findByText("New Invoice");
    expect(newInvoiceTitle).toBeInTheDocument();
  });

  it("should render the save button in the new invoice form", async () => {
    render(
      <>
        <NewInvoiceProvider initialState={{ isNewInvoiceOpen: true }}>
          <NewInvoice />
        </NewInvoiceProvider>
      </>,
    );

    const saveButton = await screen.findByText("Save");
    expect(saveButton).toBeInTheDocument();
  });

  it("should render the discard button in the new invoice form", async () => {
    render(
      <>
        <NewInvoiceProvider initialState={{ isNewInvoiceOpen: true }}>
          <NewInvoice />
        </NewInvoiceProvider>
      </>,
    );

    const cancelButton = await screen.findByText("Discard");
    expect(cancelButton).toBeInTheDocument();
  });

  it("should render the save by draft button in the new invoice form", async () => {
    render(
      <>
        <NewInvoiceProvider initialState={{ isNewInvoiceOpen: true }}>
          <NewInvoice />
        </NewInvoiceProvider>
      </>,
    );

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
});
