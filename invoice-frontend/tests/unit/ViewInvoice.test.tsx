import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router-dom";
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
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={["/invoice/1"]}>
          <Routes>
            <Route path="/invoice/:id" element={<ViewInvoice />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
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

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <MemoryRouter initialEntries={["/invoice/1"]}>
          <Routes>
            <Route path="/invoice/:id" element={<ViewInvoice />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Error: An error occurred/i)).toBeInTheDocument();
    });
  });

  it("renders invoice and handles go back", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={["/invoice/1"]}>
          <Routes>
            <Route path="/invoice/:id" element={<ViewInvoice />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Go back")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Go back"));
    expect(navigate).toHaveBeenCalledWith("/invoices");
  });

  it("renders and interacts with edit form", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={["/invoice/1"]}>
          <Routes>
            <Route path="/invoice/:id" element={<ViewInvoice />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(await screen.findByText("edit")).toBeInTheDocument();

    fireEvent.click(await screen.findByText("edit"));

    await waitFor(
      () => {
        expect(screen.getByTestId("editInvoiceModal")).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    fireEvent.change(screen.getByLabelText("Client's Name"), {
      target: { value: "Updated Client Name" },
    });

    expect(screen.getByLabelText("Client's Name")).toHaveValue(
      "Updated Client Name",
    );
  });
});

describe("ViewInvoice", () => {
  it("renders loading state", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={["/invoices/1"]}>
          <Routes>
            <Route path="/invoices/:id" element={<ViewInvoice />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
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

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <MemoryRouter initialEntries={["/invoices/1"]}>
          <Routes>
            <Route path="/invoices/:id" element={<ViewInvoice />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Error: An error occurred/i)).toBeInTheDocument();
    });
  });

  it("renders invoice and handles go back", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={["/invoices/1"]}>
          <Routes>
            <Route path="/invoices/:id" element={<ViewInvoice />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Go back")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Go back"));
    expect(navigate).toHaveBeenCalledWith("/invoices");
  });
});
