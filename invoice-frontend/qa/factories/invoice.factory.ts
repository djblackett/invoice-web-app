import { faker } from "@faker-js/faker";
import { formatDate, getPastDateFormatted } from "../helpers/date.helper";

export interface InvoiceItemData {
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  // Bill From
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  // Bill To
  clientName: string;
  clientEmail: string;
  clientStreetAddress: string;
  clientCity: string;
  clientPostalCode: string;
  clientCountry: string;
  // Invoice Details
  invoiceDate: string; // Format: "MM/DD/YYYY"
  paymentTerms: string;
  projectDescription: string;
  // Items
  items: InvoiceItemData[];
}

/**
 * Generate a single invoice item with random data
 */
export function generateInvoiceItem(
  overrides?: Partial<InvoiceItemData>,
): InvoiceItemData {
  return {
    description: faker.commerce.productName(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
    ...overrides,
  };
}

/**
 * Generate multiple invoice items
 */
export function generateInvoiceItems(
  count: number = 2,
  overrides?: Partial<InvoiceItemData>,
): InvoiceItemData[] {
  return Array.from({ length: count }, () => generateInvoiceItem(overrides));
}

/**
 * Generate a complete invoice with random data
 */
export function generateInvoice(
  overrides?: Partial<InvoiceData>,
): InvoiceData {
  // Generate a date within the last 30 days using simplified helper
  const formattedDate = getPastDateFormatted(
    faker.number.int({ min: 1, max: 30 }),
  );

  return {
    // Bill From
    streetAddress: faker.location.streetAddress(),
    city: faker.location.city(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
    // Bill To
    clientName: faker.person.fullName(),
    clientEmail: faker.internet.email(),
    clientStreetAddress: faker.location.streetAddress(),
    clientCity: faker.location.city(),
    clientPostalCode: faker.location.zipCode(),
    clientCountry: faker.location.country(),
    // Invoice Details
    invoiceDate: formattedDate,
    paymentTerms: "Net 14 Days",
    projectDescription: faker.commerce.productDescription(),
    // Items
    items: generateInvoiceItems(2),
    ...overrides,
  };
}

/**
 * Generate invoice with specific payment terms
 */
export function generateInvoiceWithPaymentTerms(
  paymentTerms: "Net 1 Day" | "Net 7 Days" | "Net 14 Days" | "Net 30 Days",
  overrides?: Partial<InvoiceData>,
): InvoiceData {
  return generateInvoice({
    paymentTerms,
    ...overrides,
  });
}

/**
 * Generate invoice with a specific date
 */
export function generateInvoiceWithDate(
  date: Date,
  overrides?: Partial<InvoiceData>,
): InvoiceData {
  return generateInvoice({
    invoiceDate: formatDate(date),
    ...overrides,
  });
}

/**
 * Generate a simple invoice with minimal data for quick tests
 */
export function generateSimpleInvoice(
  overrides?: Partial<InvoiceData>,
): InvoiceData {
  return generateInvoice({
    items: [generateInvoiceItem()],
    ...overrides,
  });
}
