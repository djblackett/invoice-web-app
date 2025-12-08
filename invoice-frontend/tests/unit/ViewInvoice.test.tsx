import { renderWithProviders, screen, fireEvent, waitFor } from "../testUtils";
import { Route, Routes } from "react-router-dom";
import ViewInvoice from "@/features/invoices/pages/ViewInvoice.tsx";
import { GET_INVOICE_BY_ID } from "@/features/invoices/graphql/invoice.queries.ts";
import { describe, it, expect, vi } from "vitest";

const navigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useNavigate: () => navigate,
  };
});

const mocks = [
  {
    request: {
      query: GET_INVOICE_BY_ID,
      variables: { getInvoiceById: "1" },
    },
    result: {
      data: {
        getInvoiceById: {
          id: "1",
          clientAddress: {
            street: "123 Main St",
            city: "Anytown",
            postCode: "12345",
            country: "USA",
          },
          clientEmail: "client@example.com",
          clientName: "Client Name",
          createdAt: "2023-01-01",
          description: "Invoice description",
          items: [
            {
              id: "item-1",
              name: "Sample Item",
              price: 500,
              quantity: 2,
              total: 1000,
            },
          ],
          paymentDue: "2023-01-15",
          paymentTerms: 30, // Payment terms as a number (e.g., 30 for Net 30)
          senderAddress: {
            street: "456 Another St",
            city: "OtherTown",
            postCode: "67890",
            country: "USA",
          },
          status: "Pending",
          total: 1000,
          __typename: "Invoice",
        },
      },
    },
  },
];

describe("ViewInvoice", () => {
  it("renders loading state", () => {
    renderWithProviders(
      <Routes>
        <Route path="/invoice/:id" element={<ViewInvoice />} />
      </Routes>,
      { mocks, route: "/invoice/1" },
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("renders error state", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_INVOICE_BY_ID,
          variables: { getInvoiceById: "1" },
        },
        error: new Error("An error occurred"),
      },
    ];

    renderWithProviders(
      <Routes>
        <Route path="/invoice/:id" element={<ViewInvoice />} />
      </Routes>,
      { mocks: errorMocks, route: "/invoice/1" },
    );

    await waitFor(() => {
      expect(screen.getByText(/Error: An error occurred/i)).toBeInTheDocument();
    });
  });

  it("renders invoice and handles go back", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/invoice/:id" element={<ViewInvoice />} />
      </Routes>,
      { mocks, route: "/invoice/1" },
    );

    await waitFor(() => {
      expect(screen.getByText("Go back")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Go back"));
    expect(navigate).toHaveBeenCalledWith("/invoices");
  });
});

describe("ViewInvoice", () => {
  it("renders loading state", () => {
    renderWithProviders(
      <Routes>
        <Route path="/invoices/:id" element={<ViewInvoice />} />
      </Routes>,
      { mocks, route: "/invoices/1" },
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("renders error state", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_INVOICE_BY_ID,
          variables: { getInvoiceById: "1" },
        },
        error: new Error("An error occurred"),
      },
    ];

    renderWithProviders(
      <Routes>
        <Route path="/invoices/:id" element={<ViewInvoice />} />
      </Routes>,
      { mocks: errorMocks, route: "/invoices/1" },
    );

    await waitFor(() => {
      expect(screen.getByText(/Error: An error occurred/i)).toBeInTheDocument();
    });
  });

  it("renders invoice and handles go back", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/invoices/:id" element={<ViewInvoice />} />
      </Routes>,
      { mocks, route: "/invoices/1" },
    );

    expect(await screen.findByText("Go back")).toBeInTheDocument();

    fireEvent.click(await screen.findByText("Go back"));
    expect(navigate).toHaveBeenCalledWith("/invoices");
  });
});
