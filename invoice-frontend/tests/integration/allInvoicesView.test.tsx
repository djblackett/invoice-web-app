import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../testUtils";
import AllInvoicesView from "@/features/invoices/components/AllInvoicesView";
import invoices from "../data/invoices";
import AllInvoicesToolbar from "@/features/invoices/components/AllInvoicesToolbar";
import {
  convertedDate,
  getMoney,
} from "@/features/shared/utils/utilityFunctions";

describe("First integration test", () => {
  vi.stubEnv("NODE_ENV", "production");

  it("should render the full list of invoices ", () => {
    render(
      <AllInvoicesView invoiceList={invoices} width={1200} loading={false} />,
    );
    const invoicesList = screen.getAllByTestId("invoice-card");
    expect(invoicesList.length).toBe(invoices.length);
  });

  it("should render the loading state", () => {
    render(<AllInvoicesView invoiceList={[]} width={1200} loading={true} />);
    const loadingGrid = screen.getByTestId("grid-loading");
    expect(loadingGrid).toBeInTheDocument();
  });

  it("should render the error state", () => {
    const error = new Error("Test error");
    render(
      <AllInvoicesView
        invoiceList={[]}
        width={1200}
        loading={false}
        error={error}
      />,
    );
    const errorMessage = screen.getByText("Test error");
    expect(errorMessage).toBeInTheDocument();
  });

  it("should render the empty list state", async () => {
    render(<AllInvoicesView invoiceList={[]} width={1200} loading={false} />);
    const emptyList = await screen.findByText("There is nothing here");
    expect(emptyList).toBeInTheDocument();
  });

  it("should render the waking up the backend message", () => {
    render(<AllInvoicesView invoiceList={[]} width={1200} loading={true} />);
    const wakingUpMessage = screen.getByText(
      "Waking up the backend containers",
    );
    expect(wakingUpMessage).toBeInTheDocument();
  });

  // This test is failing because the filter logic is happening further up the component tree
  // Will need to mock the useInvoices hook to test this
  it.skip("should render only the list of pending invoices", async () => {
    const pendingInvoices = invoices.filter(
      (invoice) => invoice.status === "pending",
    );

    render(
      <>
        <AllInvoicesToolbar invoiceList={invoices} />
        <AllInvoicesView invoiceList={invoices} width={1200} loading={false} />
      </>,
    );

    const filterButton = await screen.findByTestId("filterButton");
    fireEvent.click(filterButton);
    const pendingFilter = await screen.findByTestId("pending-checkbox");
    fireEvent.click(pendingFilter);
    const invoicesList = await screen.findAllByTestId("invoice-card");
    expect(invoicesList.length).toBe(pendingInvoices.length);
  });

  it("should render an invoice's id in the invoice card", async () => {
    render(
      <AllInvoicesView invoiceList={invoices} width={1200} loading={false} />,
    );

    const invoiceId = await screen.findByText(invoices[0].id);
    expect(invoiceId).toBeInTheDocument();
  });

  it("should render an invoice's status in the invoice card", async () => {
    render(
      <AllInvoicesView invoiceList={invoices} width={1200} loading={false} />,
    );

    const paidInvoices = invoices.filter(
      (invoice) => invoice.status === "paid",
    );

    // Capitalize the first letter of the status
    const invoiceStatus = await screen.findAllByText("Paid");
    expect(invoiceStatus).toHaveLength(paidInvoices.length);
  });

  it("should render an invoice's client name in the invoice card", async () => {
    render(
      <AllInvoicesView invoiceList={invoices} width={1200} loading={false} />,
    );

    const clientName = await screen.findByText(invoices[0].clientName);
    expect(clientName).toBeInTheDocument();
  });

  it("should render an invoice's total in the invoice card", async () => {
    render(
      <AllInvoicesView invoiceList={invoices} width={1200} loading={false} />,
    );

    const totalString = getMoney(invoices[0].total);
    const pattern = new RegExp(totalString, "g");
    const total = await screen.findByText(pattern);

    expect(total).toBeInTheDocument();
  });

  it("should render an invoice's paymentDue date in the invoice card", async () => {
    render(
      <AllInvoicesView invoiceList={invoices} width={1200} loading={false} />,
    );

    const arr = convertedDate(invoices[0].paymentDue).split(/ +/);
    const str = arr.join("\\s+");
    const pattern = new RegExp(str, "g");
    const createdAt = await screen.findByText(pattern);
    expect(createdAt).toBeInTheDocument();
  });
});
