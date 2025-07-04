import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { RunnerTestCase } from "vitest";

// Shared GraphQL documents
export const GQL = {
  DELETE_ALL: gql`
    mutation {
      deleteAllInvoices {
        acknowledged
      }
    }
  `,

  ADD_INVOICE: gql`
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
      }
    }
  `,
  APPLY_PAYMENT: gql`
    mutation ApplyPayment($invoiceId: String!, $amountPaid: Float!) {
      applyPayment(invoiceId: $invoiceId, amountPaid: $amountPaid) {
        id
        amountPaid
        status
      }
    }
  `,
  GET_INVOICE: gql`
    query GetInvoice($id: String!) {
      getInvoiceById(id: $id) {
        id
        amountPaid
        status
        payments {
          amount
          date
        }
      }
    }
  `,
};

/* ──────────────────────────────────────────────
 * 2. Helper wrappers
 * ────────────────────────────────────────────── */

/** Attaches Authorization header once. */
function withAuth(t: any, token: string): any {
  return t.set("Authorization", `Bearer ${token}`);
}

/** Generic GraphQL execution that returns typed data/errors. */
export async function exec<T>(
  app: unknown,
  doc: DocumentNode,
  variables: Record<string, unknown>,
  token: string,
) {
  return withAuth(
    request(app).query(doc).variables(variables),
    token,
  ) as unknown as { data: T; errors?: { message: string }[] };
}

/* Domain-specific shortcuts to reduce boilerplate in test files*/
export const wipeInvoices = (app: unknown, token: string) =>
  exec<{ deleteAllInvoices: { acknowledged: boolean } }>(
    app,
    GQL.DELETE_ALL,
    {},
    token,
  );

export const createInvoice = (
  app: unknown,
  token: string,
  invoice: import("../../src/constants/types").Invoice,
) =>
  exec<{ addInvoice: { id: string } }>(
    app,
    GQL.ADD_INVOICE,
    {
      clientAddress: invoice.clientAddress,
      clientEmail: invoice.clientEmail,
      clientName: invoice.clientName,
      createdAt: invoice.createdAt,
      description: invoice.description,
      id: invoice.id,
      items: invoice.items,
      paymentDue: invoice.paymentDue,
      paymentTerms: invoice.paymentTerms,
      senderAddress: invoice.senderAddress,
      status: invoice.status,
      total: invoice.total,
    },
    token,
  );

export const applyPayment = (
  app: unknown,
  token: string,
  invoiceId: string,
  amountPaid: number,
) =>
  exec<{ applyPayment: { id: string; amountPaid: number; status: string } }>(
    app,
    GQL.APPLY_PAYMENT,
    { invoiceId, amountPaid }, // ← align names
    token,
  );

export const getInvoice = (app: unknown, token: string, id: string) =>
  exec<{
    getInvoiceById: {
      id: string;
      amountPaid: number;
      status: string;
      payments: { amount: number; date: string }[];
    };
  }>(app, GQL.GET_INVOICE, { id }, token);
