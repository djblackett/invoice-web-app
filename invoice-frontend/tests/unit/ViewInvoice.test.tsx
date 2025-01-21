import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ViewInvoice from "../../src/pages/ViewInvoice";
import { GET_INVOICE_BY_ID } from "../../src/graphql/queries";
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
          clientAddress: "123 Main St",
          clientEmail: "client@example.com",
          clientName: "Client Name",
          createdAt: "2023-01-01",
          description: "Invoice description",
          items: [],
          paymentDue: "2023-01-15",
          paymentTerms: "Net 30",
          senderAddress: "456 Another St",
          status: "Pending",
          total: 1000,
          __typename: "Invoice",
        },
      },
    },
  },
];

const errorMocks = [
  {
    request: {
      query: GET_INVOICE_BY_ID,
      variables: { getInvoiceById: "1" },
    },
    error: new Error("An error occurred"),
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

  it("renders invoice details", async () => {
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
      expect(screen.getByText("Invoice description")).toBeInTheDocument();
      expect(screen.getByText("Client Name")).toBeInTheDocument();
      expect(screen.getByText("123 Main St")).toBeInTheDocument();
      expect(screen.getByText("client@example.com")).toBeInTheDocument();
      expect(screen.getByText("Pending")).toBeInTheDocument();
    });
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

    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      expect(screen.getByTestId("editInvoiceModal")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Client's Name"), {
      target: { value: "Updated Client Name" },
    });

    expect(screen.getByLabelText("Client's Name")).toHaveValue(
      "Updated Client Name",
    );
  });

  it("renders and interacts with delete modal", async () => {
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
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(screen.getByTestId("deleteModal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Confirm"));

    expect(navigate).toHaveBeenCalledWith("/invoices");
  });
});

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
    expect(
      screen.getByText(
        (content, element) => element?.textContent === "Go back",
      ),
    ).toBeInTheDocument();
  });

  fireEvent.click(
    screen.getByText((content, element) => element?.textContent === "Go back"),
  );
  expect(navigate).toHaveBeenCalledWith("/invoices");
});

it("renders invoice details", async () => {
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
    expect(screen.getByText("Invoice description")).toBeInTheDocument();
    expect(screen.getByText("Client Name")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("client@example.com")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
});
// Add other invoice fields as needed

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
});
