import { render, screen } from '../testUtils';
import DateAndPayment from '../../src/components/form-components/DateAndPayment';
import { useNewInvoiceContext } from '../../src/components/form-components/NewInvoiceContextProvider';
import { afterEach, beforeEach, describe, expect, it, vi, MockedFunction } from 'vitest';

// Mock the context provider
vi.mock('../src/components/form-components/NewInvoiceContextProvider', () => ({
    useNewInvoiceContext: vi.fn(),
}));

// Mock the utility function
vi.mock('src/utils/utilityFunctions', () => ({
    convertStringToDate: vi.fn(),
}));

const invoice = {
    "id": "RT3080",
    "createdAt": "2021-08-18",
    "paymentDue": "2021-08-19",
    "description": "Re-branding",
    "paymentTerms": 1,
    "clientName": "Jensen Huang",
    "clientEmail": "jensenh@mail.com",
    "status": "paid",
    "senderAddress": {
        "street": "19 Union Terrace",
        "city": "London",
        "postCode": "E1 3EZ",
        "country": "United Kingdom"
    },
    "clientAddress": {
        "street": "106 Kendell Street",
        "city": "Sharrington",
        "postCode": "NR24 5WQ",
        "country": "United Kingdom"
    },
    "items": [
        {
            "name": "Brand Guidelines",
            "quantity": 1,
            "price": 1800.9,
            "total": 1800.9
        }
    ],
    "total": 1800.9
};

describe('DateAndPayment', () => {
    const setStartDate = vi.fn();
    const startDate = new Date();

    const mockedUseNewInvoiceContext = useNewInvoiceContext as MockedFunction<typeof useNewInvoiceContext>;

    beforeEach(() => {
        mockedUseNewInvoiceContext.mockReturnValue({
            startDate,
            setStartDate,

        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders DateAndPayment component', () => {
        render(<DateAndPayment />);
        expect(screen.getByText(/Invoice Date/i)).toBeInTheDocument();
        expect(screen.getByText(/Payment Terms/i)).toBeInTheDocument();
    });
});
