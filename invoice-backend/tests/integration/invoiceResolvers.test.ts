import request from "supertest-graphql";
import { gql } from "graphql-tag";
import { createServer } from "../../src/server";
import {
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  it,
  expect,
  afterEach,
} from "vitest";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { randomUUID } from "crypto";
import { getTestToken } from "./utils";
import container from "@/config/inversify.config";
import TYPES from "@/constants/identifiers";

process.env.NODE_ENV = "test";
const baseInvoice = {
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
};

console.log("Env vars:", process.env.DATABASE_URL);

let app: any;
let testToken: string;
let prisma: PrismaClient;
let schemaName: string;
let currentInvoiceId = "";

describe("Invoice Resolvers Integration Tests", () => {
  beforeAll(async () => {
    // testToken = await getTestToken();
    testToken = "dummy-token";
  });

  beforeEach(async () => {
    // 1. Generate a unique schema name
    // e.g., "test_schema_182b07dc-5b93-44a8-a248-77102fe91bf0"
    schemaName = `test_schema_${randomUUID()}`;

    // 2. Construct a new DB URL that includes this schema
    // Replace your own user/password/host/db as appropriate
    const baseDatabaseUrl =
      "postgresql://postgres:example@localhost:5432/db-test";
    const newDatabaseUrl = `${baseDatabaseUrl}?schema=${schemaName}`;

    // 3. Override the env var for Prisma
    // process.env.DATABASE_URL = newDatabaseUrl;

    // console.log("Env vars:", process.env.DATABASE_URL);

    // 5. Instantiate Prisma Client *after* the schema is set up
    prisma = new PrismaClient({
      datasourceUrl: newDatabaseUrl,
    });

    const child = container.createChild();

    child.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);
    console.log("Connected to Prisma", newDatabaseUrl);
    // Object.keys(prisma).forEach((key) => {
    //   console.log(key);
    // });

    await prisma.$executeRawUnsafe(
      `SET search_path TO "${schemaName}", public`,
    );
    await prisma.$connect();

    execSync("yarn prisma db push", { stdio: "inherit" });
    [app] = await createServer();
    // 4. Run "prisma db push" or "prisma migrate deploy"
    //    This ensures the schema is created and tables are set up

    // Clean up before each test
    await request(app)
      .query(gql`
        mutation DeleteAllInvoices {
          deleteAllInvoices {
            acknowledged
          }
        }
      `)
      .set("Authorization", `Bearer ${testToken}`);

    // Generate a unique invoice ID for this test
    currentInvoiceId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Re-create a single invoice with that unique ID
    const invoiceWithUniqueId = { ...baseInvoice, id: currentInvoiceId };

    await request(app)
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
      .variables(invoiceWithUniqueId)
      .set("Authorization", `Bearer ${testToken}`);
  });

  afterAll(async () => {
    // Clean up before each test
    await request(app)
      .query(gql`
        mutation DeleteAllInvoices {
          deleteAllInvoices {
            acknowledged
          }
        }
      `)
      .set("Authorization", `Bearer ${testToken}`);
  });

  afterEach(async () => {
    // 6. Drop the schema to clean up
    //    Something like: DROP SCHEMA test_schema_xxx CASCADE
    //  You can do this via a direct query.
    await prisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
    );

    // Finally, disconnect Prisma
    await prisma.$disconnect();
  });

  it("should return a list of all invoices (should be 1 now)", async () => {
    const { data } = await request(app)
      .query(gql`
        query AllInvoices {
          allInvoices {
            id
            clientName
          }
        }
      `)
      .set("Authorization", `Bearer ${testToken}`);

    expect((data as any).allInvoices).toHaveLength(1);
    expect((data as any).allInvoices[0].id).toBe(currentInvoiceId);
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
      .set("Authorization", `Bearer ${testToken}`);

    const { data } = await request(app)
      .query(gql`
        query AllInvoices {
          allInvoices {
            id
            clientName
          }
        }
      `)
      .set("Authorization", `Bearer ${testToken}`);

    expect((data as any).allInvoices).toEqual([]);
    expect((data as any).allInvoices).toHaveLength(0);
  });

  it("should return an invoice by id", async () => {
    const { data } = await request(app)
      .query(gql`
        query GetInvoiceById($id: String!) {
          getInvoiceById(id: $id) {
            id
            clientName
          }
        }
      `)
      .variables({ id: currentInvoiceId })
      .set("Authorization", `Bearer ${testToken}`);

    expect((data as any).getInvoiceById.id).toBe(currentInvoiceId);
    expect((data as any).getInvoiceById.clientName).toBe(
      baseInvoice.clientName,
    );
  });

  it("should return error when invoice not found", async () => {
    const invalidId = "INV-DOES_NOT_EXIST";

    const response = await request(app)
      .query(gql`
        query GetInvoiceById($id: String!) {
          getInvoiceById(id: $id) {
            id
            clientName
          }
        }
      `)
      .set("Authorization", `Bearer ${testToken}`)
      .variables({ id: invalidId });

    expect(response.errors).toBeDefined();
    expect(response.errors![0].message).toBe("Invoice not found");
    expect(response.errors![0].extensions.code).toBe("NOT_FOUND");
  });

  it("should add a new invoice with its own unique ID", async () => {
    const secondInvoiceId = `INV-${Date.now()}-new`;
    const newInvoice = {
      ...baseInvoice,
      id: secondInvoiceId,
      clientName: "Jane Smith",
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
      .set("Authorization", `Bearer ${testToken}`);

    expect((data as any).addInvoice.id).toBe(secondInvoiceId);
    expect((data as any).addInvoice.clientName).toBe(newInvoice.clientName);
  });

  it("should edit the existing invoice (with unique ID)", async () => {
    const updatedData = {
      id: currentInvoiceId,
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
      .set("Authorization", `Bearer ${testToken}`);

    expect((data as any).editInvoice.id).toBe(currentInvoiceId);
    expect((data as any).editInvoice.clientName).toBe(updatedData.clientName);
  });

  it("should remove an invoice (the one with our unique ID)", async () => {
    const { data } = await request(app)
      .query(gql`
        mutation RemoveInvoice($id: String!) {
          removeInvoice(id: $id)
        }
      `)
      .variables({ id: currentInvoiceId })
      .set("Authorization", `Bearer ${testToken}`);

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
      .set("Authorization", `Bearer ${testToken}`)
      .variables({ id: currentInvoiceId });

    expect(response.errors).toBeDefined();
    expect(response.errors![0].message).toBe("Invoice not found");
    expect(response.errors![0].extensions.code).toBe("NOT_FOUND");
  });

  it("should mark the invoice as paid", async () => {
    const { data } = await request(app)
      .query(gql`
        mutation MarkAsPaid($id: String!) {
          markAsPaid(id: $id) {
            id
            status
          }
        }
      `)
      .variables({ id: currentInvoiceId })
      .set("Authorization", `Bearer ${testToken}`);

    expect((data as any).markAsPaid.id).toBe(currentInvoiceId);
    expect((data as any).markAsPaid.status).toBe("paid");
  });
});

// remove orphaned test schemas
// DO $$DECLARE
//    s text;
// BEGIN
//    FOR s IN
//       SELECT nspname FROM pg_namespace
//          WHERE nspname LIKE 'test\_schema\_%'
//    LOOP
//       EXECUTE 'DROP SCHEMA ' || quote_ident(s) || ' CASCADE';
//    END LOOP;
// END;$$;
