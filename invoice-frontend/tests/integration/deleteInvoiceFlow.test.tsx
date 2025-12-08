import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  cleanup,
  fireEvent,
  renderWithProviders,
  screen,
  waitFor,
} from "../testUtils";
import DeleteModal from "@/features/invoices/components/DeleteModal";
import { REMOVE_INVOICE, ALL_INVOICES } from "@/features/invoices/graphql/invoice.queries";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Delete Invoice Flow Integration Tests", () => {
  const mockInvoice = {
    id: "RT3080",
    clientName: "Jensen Huang",
  };

  const mocks = [
    {
      request: {
        query: REMOVE_INVOICE,
        variables: { removeInvoiceId: "RT3080" },
      },
      result: {
        data: {
          removeInvoice: { id: "RT3080" },
        },
      },
    },
    {
      request: {
        query: ALL_INVOICES,
      },
      result: {
        data: {
          invoices: [],
        },
      },
    },
  ];

  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
  });

  it("should render delete confirmation modal when open", () => {
    const setIsModalOpen = vi.fn();

    renderWithProviders(
      <DeleteModal
        isModalOpen={true}
        setIsModalOpen={setIsModalOpen}
        invoice={mockInvoice}
      />,
      { mocks, route: "/invoices/RT3080" },
    );

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
  });

  it("should display invoice ID in confirmation message", () => {
    const setIsModalOpen = vi.fn();

    renderWithProviders(
      <DeleteModal
        isModalOpen={true}
        setIsModalOpen={setIsModalOpen}
        invoice={mockInvoice}
      />,
      { mocks, route: "/invoices/RT3080" },
    );

    expect(
      screen.getByText(/Are you sure you want to delete invoice #RT3080/i),
    ).toBeInTheDocument();
  });

  it("should show delete and cancel buttons", () => {
    const setIsModalOpen = vi.fn();

    renderWithProviders(
      <DeleteModal
        isModalOpen={true}
        setIsModalOpen={setIsModalOpen}
        invoice={mockInvoice}
      />,
      { mocks, route: "/invoices/RT3080" },
    );

    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("should close modal when cancel is clicked", () => {
    const setIsModalOpen = vi.fn();

    renderWithProviders(
      <DeleteModal
        isModalOpen={true}
        setIsModalOpen={setIsModalOpen}
        invoice={mockInvoice}
      />,
      { mocks, route: "/invoices/RT3080" },
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(setIsModalOpen).toHaveBeenCalledWith(false);
  });

  it("should not render modal when isModalOpen is false", () => {
    const setIsModalOpen = vi.fn();

    renderWithProviders(
      <DeleteModal
        isModalOpen={false}
        setIsModalOpen={setIsModalOpen}
        invoice={mockInvoice}
      />,
      { mocks, route: "/invoices/RT3080" },
    );

    expect(screen.queryByText("Confirm Deletion")).not.toBeVisible();
  });

  it("should have delete button with proper styling", () => {
    const setIsModalOpen = vi.fn();

    renderWithProviders(
      <DeleteModal
        isModalOpen={true}
        setIsModalOpen={setIsModalOpen}
        invoice={mockInvoice}
      />,
      { mocks, route: "/invoices/RT3080" },
    );

    const deleteButton = screen.getByText("Delete");
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton.tagName).toBe("BUTTON");
  });

  it("should render modal overlay when open", () => {
    const setIsModalOpen = vi.fn();

    const { container } = renderWithProviders(
      <DeleteModal
        isModalOpen={true}
        setIsModalOpen={setIsModalOpen}
        invoice={mockInvoice}
      />,
      { mocks, route: "/invoices/RT3080" },
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it("should display warning message about action being permanent", () => {
    const setIsModalOpen = vi.fn();

    renderWithProviders(
      <DeleteModal
        isModalOpen={true}
        setIsModalOpen={setIsModalOpen}
        invoice={mockInvoice}
      />,
      { mocks, route: "/invoices/RT3080" },
    );

    expect(
      screen.getByText(/This action cannot be undone/i),
    ).toBeInTheDocument();
  });
});
