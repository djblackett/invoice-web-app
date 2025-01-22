import request from "supertest-graphql";
import { gql } from "graphql-tag";
import { createServer } from "../../src/server";
import { describe, beforeAll, afterAll, beforeEach, it, expect } from "vitest";

let app: any;

console.log("NODE_ENV:", process.env.NODE_ENV);

const invoices = [
  {
    id: "INV-0001",
    createdAt: "2023-01-01",
    paymentDue: "2023-01-15",
    description: "Website Design",
    paymentTerms: 14,
    clientName: "John Doe",
    clientEmail: "john.doe@example.com",
    status: "pending",
    senderAddress: {
      street: "123 Main St",
      city: "Anytown",
      postCode: "12345",
      country: "USA",
    },
    clientAddress: {
      street: "456 Side St",
      city: "Othertown",
      postCode: "67890",
      country: "USA",
    },
    items: [
      {
        id: "item-1",
        name: "Design Work",
        quantity: 1,
        price: 1000,
        total: 1000,
      },
    ],
    total: 1000,
  },
];

async function createInvoices() {
  const invoicePromises = invoices.map((invoice) => {
    return request(app)
      .query(gql`
        mutation AddInvoice(
          $clientAddress: ClientInfo
          $clientEmail: String
          $clientName: String
          $createdAt: String
          $description: String
          $id: String
          $items: [ItemInput]
          $paymentDue: String
          $paymentTerms: Float
          $senderAddress: SenderInfo
          $status: String
          $total: Float
        ) {
          addInvoice(
            clientAddress: $clientAddress
            clientEmail: $clientEmail
            clientName: $clientName
            createdAt: $createdAt
            description: $description
            id: $id
            items: $items
            paymentDue: $paymentDue
            paymentTerms: $paymentTerms
            senderAddress: $senderAddress
            status: $status
            total: $total
          ) {
            id
            clientName
          }
        }
      `)
      .variables(invoice)
      .expectNoErrors();
  });

  await Promise.all(invoicePromises);
}

describe("Invoice Resolvers Integration Tests", () => {
  beforeAll(async () => {
    [app] = await createServer();

    // Delete all invoices before starting tests (assuming you have this mutation)
    await request(app)
      .query(gql`
        mutation DeleteAllInvoices {
          deleteAllInvoices {
            acknowledged
          }
        }
      `)
      .expectNoErrors();

    // Create sample invoices
    // await createInvoices();
  });

  afterAll(async () => {
    // Clean up after all tests
    await request(app)
      .query(gql`
        mutation DeleteAllInvoices {
          deleteAllInvoices {
            acknowledged
          }
        }
      `)
      .expectNoErrors();
  });

  beforeEach(async () => {
    // Clean up before each test
    await request(app)
      .query(gql`
        mutation DeleteAllInvoices {
          deleteAllInvoices {
            acknowledged
          }
        }
      `)
      .expectNoErrors();

    // Re-create invoices for each test
    await createInvoices();
  });

  it("should return a list of all invoices", async () => {
    const { data } = await request(app)
      .query(gql`
        query AllInvoices {
          allInvoices {
            id
            clientName
          }
        }
      `)
      .expectNoErrors();

    expect((data as any).allInvoices).toHaveLength(invoices.length);
  });

  it("should return empty array when no invoices exist", async () => {
    // Delete all invoices
    await request(app)
      .query(gql`
        mutation DeleteAllInvoices {
          deleteAllInvoices {
            acknowledged
          }
        }
      `)
      .expectNoErrors();

    const { data } = await request(app)
      .query(gql`
        query AllInvoices {
          allInvoices {
            id
            clientName
          }
        }
      `)
      .expectNoErrors();

    expect((data as any).allInvoices).toEqual([]);
    expect((data as any).allInvoices).toHaveLength(0);
  });

  it("should return an invoice by id", async () => {
    const invoiceId = invoices[0].id;

    const { data } = await request(app)
      .query(gql`
        query GetInvoiceById($id: String!) {
          getInvoiceById(id: $id) {
            id
            clientName
          }
        }
      `)
      .variables({ id: invoiceId })
      .expectNoErrors();

    expect((data as any).getInvoiceById.id).toBe(invoiceId);
    expect((data as any).getInvoiceById.clientName).toBe(
      invoices[0].clientName,
    );
  });

  it("should return error when invoice not found", async () => {
    const invalidId = "INV-9999";

    const response = await request(app)
      .query(gql`
        query GetInvoiceById($id: String!) {
          getInvoiceById(id: $id) {
            id
            clientName
          }
        }
      `)
      .variables({ id: invalidId });

    expect(response.errors).toBeDefined();
    expect(response.errors![0].message).toBe("Invoice not found");
    expect(response.errors![0].extensions.code).toBe("NOT_FOUND");
  });

  it("should add a new invoice", async () => {
    const newInvoice = {
      id: "INV-0002",
      createdAt: "2023-02-01",
      paymentDue: "2023-02-15",
      description: "Development Work",
      paymentTerms: 14,
      clientName: "Jane Smith",
      clientEmail: "jane.smith@example.com",
      status: "pending",
      senderAddress: {
        street: "123 Main St",
        city: "Anytown",
        postCode: "12345",
        country: "USA",
      },
      clientAddress: {
        street: "789 Other St",
        city: "Othertown",
        postCode: "67890",
        country: "USA",
      },
      items: [
        {
          id: "item-2",
          name: "Development Work",
          quantity: 2,
          price: 1500,
          total: 3000,
        },
      ],
      total: 3000,
    };

    const { data } = await request(app)
      .query(gql`
        mutation AddInvoice(
          $clientAddress: ClientInfo
          $clientEmail: String
          $clientName: String
          $createdAt: String
          $description: String
          $id: String
          $items: [ItemInput]
          $paymentDue: String
          $paymentTerms: Float
          $senderAddress: SenderInfo
          $status: String
          $total: Float
        ) {
          addInvoice(
            clientAddress: $clientAddress
            clientEmail: $clientEmail
            clientName: $clientName
            createdAt: $createdAt
            description: $description
            id: $id
            items: $items
            paymentDue: $paymentDue
            paymentTerms: $paymentTerms
            senderAddress: $senderAddress
            status: $status
            total: $total
          ) {
            id
            clientName
          }
        }
      `)
      .variables(newInvoice)
      .expectNoErrors();

    expect((data as any).addInvoice.id).toBe(newInvoice.id);
    expect((data as any).addInvoice.clientName).toBe(newInvoice.clientName);
  });

  it("should edit an existing invoice", async () => {
    const invoiceId = invoices[0].id;
    const updatedData = {
      id: invoiceId,
      clientName: "Johnathan Doe",
    };

    const { data } = await request(app)
      .query(gql`
        mutation EditInvoice(
          $clientAddress: ClientInfo
          $clientEmail: String
          $clientName: String
          $createdAt: String
          $description: String
          $id: String
          $items: [ItemInput]
          $paymentDue: String
          $paymentTerms: Float
          $senderAddress: SenderInfo
          $status: String
          $total: Float
        ) {
          editInvoice(
            clientAddress: $clientAddress
            clientEmail: $clientEmail
            clientName: $clientName
            createdAt: $createdAt
            description: $description
            id: $id
            items: $items
            paymentDue: $paymentDue
            paymentTerms: $paymentTerms
            senderAddress: $senderAddress
            status: $status
            total: $total
          ) {
            id
            clientName
          }
        }
      `)
      .variables(updatedData)
      .expectNoErrors();

    expect((data as any).editInvoice.id).toBe(invoiceId);
    expect((data as any).editInvoice.clientName).toBe(updatedData.clientName);
  });

  it("should remove an invoice", async () => {
    const invoiceId = invoices[0].id;

    const { data } = await request(app)
      .query(gql`
        mutation RemoveInvoice($id: String!) {
          removeInvoice(id: $id)
        }
      `)
      .variables({ id: invoiceId })
      .expectNoErrors();

    // Verify the invoice is removed
    const response = await request(app)
      .query(gql`
        query GetInvoiceById($id: String!) {
          getInvoiceById(id: $id) {
            id
            clientName
          }
        }
      `)
      .variables({ id: invoiceId });

    expect(response.errors).toBeDefined();
    expect(response.errors![0].message).toBe("Invoice not found");
    expect(response.errors![0].extensions.code).toBe("NOT_FOUND");
    // expect(ids).not.toContain(invoiceId);
  });

  it("should mark an invoice as paid", async () => {
    const invoiceId = invoices[0].id;

    const { data } = await request(app)
      .query(gql`
        mutation MarkAsPaid($id: String!) {
          markAsPaid(id: $id) {
            id
            status
          }
        }
      `)
      .variables({ id: invoiceId })
      .expectNoErrors();

    expect((data as any).markAsPaid.id).toBe(invoiceId);
    expect((data as any).markAsPaid.status).toBe("paid");
  });
});
