/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render, screen } from "../testUtils";
import DateAndPayment from "@/components/form-components/DateAndPayment";
import { useNewInvoiceContext } from "@/components/form-components/NewInvoiceContextProvider";
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
vi.mock("@/components/form-components/NewInvoiceContextProvider", () => ({
  useNewInvoiceContext: vi.fn(),
}));

// Mock the utility function
vi.mock("@/utils/utilityFunctions", () => ({
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

  it("renders DateAndPayment component", () => {
    render(<DateAndPayment />);
    expect(screen.getByText(/Invoice Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Payment Terms/i)).toBeInTheDocument();
  });
});
