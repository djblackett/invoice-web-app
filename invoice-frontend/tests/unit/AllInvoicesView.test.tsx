import { render, screen } from "../testUtils";
import AllInvoicesView from "@/features/invoices/components/AllInvoicesView.tsx";
import { describe, it, expect, beforeEach } from "vitest";
import { Invoice } from "@/features/invoices/types/invoiceTypes";

describe("AllInvoicesView", () => {
  const mockInvoices: Invoice[] = [
    {
      id: "RT3080",
      createdAt: "2021-08-18",
      paymentDue: "2021-08-19",
      description: "Re-branding",
      paymentTerms: 1,
      clientName: "Jensen Huang",
      clientEmail: "jensenh@mail.com",
      status: "paid",
      senderAddress: {
        street: "19 Union Terrace",
        city: "London",
        postCode: "E1 3EZ",
        country: "United Kingdom",
      },
      clientAddress: {
        street: "106 Kendell Street",
        city: "Sharrington",
        postCode: "NR24 5WQ",
        country: "United Kingdom",
      },
      items: [
        {
          name: "Brand Guidelines",
          quantity: 1,
          price: 1800.9,
          total: 1800.9,
        },
      ],
      total: 1800.9,
    },
    {
      id: "XM9141",
      createdAt: "2021-08-21",
      paymentDue: "2021-09-20",
      description: "Graphic Design",
      paymentTerms: 30,
      clientName: "Alex Grim",
      clientEmail: "alexgrim@mail.com",
      status: "pending",
      senderAddress: {
        street: "19 Union Terrace",
        city: "London",
        postCode: "E1 3EZ",
        country: "United Kingdom",
      },
      clientAddress: {
        street: "84 Church Way",
        city: "Bradford",
        postCode: "BD1 9PB",
        country: "United Kingdom",
      },
      items: [
        {
          name: "Banner Design",
          quantity: 1,
          price: 156.0,
          total: 156.0,
        },
      ],
      total: 556.0,
    },
  ];

  beforeEach(() => {
    // Reset any mocks if needed
  });

  it("renders loading spinner when loading is true", () => {
    render(
      <AllInvoicesView
        invoiceList={[]}
        width={1200}
        loading={true}
        error={undefined}
      />,
    );

    expect(screen.getByLabelText("grid-loading")).toBeInTheDocument();
  });

  it("renders error message when error is provided", () => {
    const error = new Error("Failed to fetch invoices");
    render(
      <AllInvoicesView
        invoiceList={[]}
        width={1200}
        loading={false}
        error={error}
      />,
    );

    expect(screen.getByText("Failed to fetch invoices")).toBeInTheDocument();
  });

  it("renders empty list when no invoices are provided", () => {
    render(
      <AllInvoicesView
        invoiceList={[]}
        width={1200}
        loading={false}
        error={undefined}
      />,
    );

    expect(
      screen.getByText(/There is nothing here/i),
    ).toBeInTheDocument();
  });

  it("renders invoice cards when invoices are provided", () => {
    render(
      <AllInvoicesView
        invoiceList={mockInvoices}
        width={1200}
        loading={false}
        error={undefined}
      />,
    );

    expect(screen.getByText("RT3080")).toBeInTheDocument();
    expect(screen.getByText("XM9141")).toBeInTheDocument();
  });

  it("renders links to individual invoice pages", () => {
    render(
      <AllInvoicesView
        invoiceList={mockInvoices}
        width={1200}
        loading={false}
        error={undefined}
      />,
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "#/invoices/RT3080");
    expect(links[1]).toHaveAttribute("href", "#/invoices/XM9141");
  });

  it("displays client names for each invoice", () => {
    render(
      <AllInvoicesView
        invoiceList={mockInvoices}
        width={1200}
        loading={false}
        error={undefined}
      />,
    );

    expect(screen.getByText("Jensen Huang")).toBeInTheDocument();
    expect(screen.getByText("Alex Grim")).toBeInTheDocument();
  });

  it("applies mobile styling when width is less than 1200", () => {
    const { container } = render(
      <AllInvoicesView
        invoiceList={mockInvoices}
        width={800}
        loading={false}
        error={undefined}
      />,
    );

    const links = container.querySelectorAll("a");
    expect(links.length).toBeGreaterThan(0);
  });

  it("applies desktop styling when width is 1200 or more", () => {
    const { container } = render(
      <AllInvoicesView
        invoiceList={mockInvoices}
        width={1200}
        loading={false}
        error={undefined}
      />,
    );

    const links = container.querySelectorAll("a");
    expect(links.length).toBeGreaterThan(0);
  });

  it("renders correct invoice status for each card", () => {
    render(
      <AllInvoicesView
        invoiceList={mockInvoices}
        width={1200}
        loading={false}
        error={undefined}
      />,
    );

    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("displays invoice totals", () => {
    render(
      <AllInvoicesView
        invoiceList={mockInvoices}
        width={1200}
        loading={false}
        error={undefined}
      />,
    );

    expect(screen.getByText(/1,?800.90/i)).toBeInTheDocument();
    expect(screen.getByText(/556.00/i)).toBeInTheDocument();
  });

  it("handles single invoice correctly", () => {
    render(
      <AllInvoicesView
        invoiceList={[mockInvoices[0]]}
        width={1200}
        loading={false}
        error={undefined}
      />,
    );

    expect(screen.getByText("RT3080")).toBeInTheDocument();
    expect(screen.queryByText("XM9141")).not.toBeInTheDocument();
  });

  it("sets tabIndex to -1 on links", () => {
    render(
      <AllInvoicesView
        invoiceList={mockInvoices}
        width={1200}
        loading={false}
        error={undefined}
      />,
    );

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("tabindex", "-1");
    });
  });

  it("renders invoice grid container", () => {
    const { container } = render(
      <AllInvoicesView
        invoiceList={mockInvoices}
        width={1200}
        loading={false}
        error={undefined}
      />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
