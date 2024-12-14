/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render, screen } from "../testUtils";
import DateAndPayment from "../../src/components/form-components/DateAndPayment";
import { useNewInvoiceContext } from "../../src/components/form-components/NewInvoiceContextProvider";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  MockedFunction,
} from "vitest";

// Mock the context provider
vi.mock("../src/components/form-components/NewInvoiceContextProvider", () => ({
  useNewInvoiceContext: vi.fn(),
}));

// Mock the utility function
vi.mock("src/utils/utilityFunctions", () => ({
  convertStringToDate: vi.fn(),
}));

describe("DateAndPayment", () => {
  const setStartDate = vi.fn();
  const startDate = new Date();

  const mockedUseNewInvoiceContext = useNewInvoiceContext as MockedFunction<
    typeof useNewInvoiceContext
  >;

  beforeEach(() => {
    // @ts-ignore
    mockedUseNewInvoiceContext.mockReturnValue({
      startDate,
      setStartDate,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it.skip("renders DateAndPayment component", () => {
    render(<DateAndPayment />);
    // @ts-ignore
    expect(screen.getByText(/Invoice Date/i)).toBeInTheDocument();
    // @ts-ignore
    expect(screen.getByText(/Payment Terms/i)).toBeInTheDocument();
  });
});
