import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "../testUtils";
import { MockedProvider } from "@apollo/client/testing";
import DeleteModal, {
  DeleteModalProps,
} from "@/features/invoices/components/DeleteModal.tsx";
import {
  REMOVE_INVOICE,
  ALL_INVOICES,
} from "@/features/invoices/graphql/invoice.queries.ts";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/features/shared/styles/Themes.ts";
import "@testing-library/jest-dom";

const mocks = [
  {
    request: {
      query: REMOVE_INVOICE,
      variables: { removeInvoiceId: "1" },
    },
    result: {
      data: {
        removeInvoice: { id: "1" },
      },
    },
  },
  {
    request: {
      query: ALL_INVOICES,
    },
    result: {
      data: {
        invoices: [{ id: "1", name: "Test Invoice" }],
      },
    },
  },
];

describe("DeleteModal", () => {
  const defaultProps: DeleteModalProps = {
    isModalOpen: true,
    setIsModalOpen: vi.fn(),
    invoice: { id: "1" },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly when modal is open", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DeleteModal {...defaultProps} />
      </MockedProvider>,
    );

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete invoice/),
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls setIsModalOpen when cancel button is clicked", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DeleteModal {...defaultProps} />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.setIsModalOpen).toHaveBeenCalledWith(false);
  });

  it("does not render modal when isModalOpen is false", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ThemeProvider theme={lightTheme}>
          <DeleteModal {...defaultProps} isModalOpen={false} />
        </ThemeProvider>
      </MockedProvider>,
    );

    expect(screen.queryByText("Confirm Deletion")).not.toBeVisible();
  });
});
