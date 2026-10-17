import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, renderHook } from "@testing-library/react";
import useInvoices from "../../../src/features/invoices/hooks/useInvoices.ts";
import { useQuery } from "@apollo/client";
import { ApolloError } from "@apollo/client/errors";
import { useSelector } from "react-redux";

// Mock dependencies
vi.mock("@apollo/client", () => ({
  useQuery: vi.fn(),
  gql: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("../graphql/invoice.queries.ts", () => ({
  ALL_INVOICES: "ALL_INVOICES_QUERY",
}));

describe("useInvoices", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should return empty array when no data is available", () => {
    vi.mocked(useQuery, { partial: true }).mockReturnValue({
      data: null,
      loading: false,
      error: undefined,
    });

    vi.mocked(useSelector).mockReturnValue({
      draft: false,
      pending: false,
      paid: false,
    });

    const { result } = renderHook(() => useInvoices());

    expect(result.current.invoiceList).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("should return all invoices when no filter is applied", () => {
    const mockInvoices = [
      { id: "1", status: "draft" },
      { id: "2", status: "pending" },
      { id: "3", status: "paid" },
    ];

    vi.mocked(useQuery, { partial: true }).mockReturnValue({
      data: { allInvoices: mockInvoices },
      loading: false,
      error: undefined,
    });

    vi.mocked(useSelector).mockReturnValue({
      draft: false,
      pending: false,
      paid: false,
    });

    const { result } = renderHook(() => useInvoices());

    expect(result.current.invoiceList).toEqual(mockInvoices);
  });

  it("should filter invoices by draft status", () => {
    const mockInvoices = [
      { id: "1", status: "draft" },
      { id: "2", status: "pending" },
      { id: "3", status: "paid" },
    ];

    vi.mocked(useQuery, { partial: true }).mockReturnValue({
      data: { allInvoices: mockInvoices },
      loading: false,
      error: undefined,
    });

    vi.mocked(useSelector).mockReturnValue({
      draft: true,
      pending: false,
      paid: false,
    });

    const { result } = renderHook(() => useInvoices());

    expect(result.current.invoiceList).toEqual([{ id: "1", status: "draft" }]);
  });

  it("should filter invoices by pending status", () => {
    const mockInvoices = [
      { id: "1", status: "draft" },
      { id: "2", status: "pending" },
      { id: "3", status: "paid" },
    ];

    vi.mocked(useQuery, { partial: true }).mockReturnValue({
      data: { allInvoices: mockInvoices },
      loading: false,
      error: undefined,
    });

    vi.mocked(useSelector).mockReturnValue({
      draft: false,
      pending: true,
      paid: false,
    });

    const { result } = renderHook(() => useInvoices());

    expect(result.current.invoiceList).toEqual([
      { id: "2", status: "pending" },
    ]);
  });

  it("should filter invoices by paid status", () => {
    const mockInvoices = [
      { id: "1", status: "draft" },
      { id: "2", status: "pending" },
      { id: "3", status: "paid" },
    ];

    vi.mocked(useQuery, { partial: true }).mockReturnValue({
      data: { allInvoices: mockInvoices },
      loading: false,
      error: undefined,
    });

    vi.mocked(useSelector).mockReturnValue({
      draft: false,
      pending: false,
      paid: true,
    });

    const { result } = renderHook(() => useInvoices());

    expect(result.current.invoiceList).toEqual([{ id: "3", status: "paid" }]);
  });

  it("should return all invoices when all filters are applied", () => {
    const mockInvoices = [
      { id: "1", status: "draft" },
      { id: "2", status: "pending" },
      { id: "3", status: "paid" },
    ];

    vi.mocked(useQuery, { partial: true }).mockReturnValue({
      data: { allInvoices: mockInvoices },
      loading: false,
      error: undefined,
    });

    vi.mocked(useSelector).mockReturnValue({
      draft: true,
      pending: true,
      paid: true,
    });

    const { result } = renderHook(() => useInvoices());

    expect(result.current.invoiceList).toEqual(mockInvoices);
  });

  it("should handle loading state correctly", () => {
    vi.mocked(useQuery, { partial: true }).mockReturnValue({
      data: null,
      loading: true,
      error: undefined,
    });

    vi.mocked(useSelector).mockReturnValue({
      draft: false,
      pending: false,
      paid: false,
    });

    const { result } = renderHook(() => useInvoices());

    expect(result.current.loading).toBe(true);
  });

  it("should handle error state correctly", () => {
    const mockError = new ApolloError({
      errorMessage: "Failed to fetch invoices",
    });

    vi.mocked(useQuery, { partial: true }).mockReturnValue({
      data: null,
      loading: false,
      error: mockError,
    });

    vi.mocked(useSelector).mockReturnValue({
      draft: false,
      pending: false,
      paid: false,
    });

    const { result } = renderHook(() => useInvoices());

    expect(result.current.error).toBe(mockError);
  });
});
