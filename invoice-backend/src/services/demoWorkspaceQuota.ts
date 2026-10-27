import type { DbClient } from "../database/database.connection";
import type { Invoice } from "../constants/types";
import { ValidationException } from "../config/exception.config";

// Single source of truth for temporary-workspace limits. Resource limits were
// agreed in the Phase 1 investigation; budget/reset/text values are PROVISIONAL
// policy choices, not measured capacity.
export const DEMO_WORKSPACE_LIMITS = {
  invoices: 30, // including the seven sample invoices
  revisions: 200, // retained, across the whole workspace
  itemsPerInvoice: 20,
  mutations: 200, // per session lifetime; resets consume one and never refund
  resets: 5, // per session lifetime
  resetCooldownMs: 2 * 60_000,
} as const;

export const DEMO_TEXT_LIMITS = {
  clientName: 100,
  clientEmail: 254,
  description: 500,
  status: 16,
  createdAt: 32,
  paymentDue: 32,
  street: 120,
  city: 80,
  postCode: 20,
  country: 60,
  itemName: 100,
} as const;

export interface WorkspaceUsage {
  invoices: number;
  revisions: number;
  maxItemsPerInvoice: number;
}

/**
 * Measures retained rows rather than trusting counters, so restore/reset can
 * never "refund" capacity and no stored total can drift from the data. Only
 * exact while the caller holds the session lock (see demoSessionWrite.ts).
 */
export async function measureWorkspaceUsage(
  tx: DbClient,
  userId: string,
): Promise<WorkspaceUsage> {
  const [usage] = await tx.$queryRaw<WorkspaceUsage[]>`
    SELECT
      (SELECT count(*)::int FROM "Invoice" WHERE "createdById" = ${userId})
        AS "invoices",
      (SELECT count(*)::int FROM "InvoiceRevision" r
        JOIN "Invoice" i ON i."id" = r."invoiceId"
        WHERE i."createdById" = ${userId}) AS "revisions",
      (SELECT coalesce(max(n), 0)::int FROM (
        SELECT count(*) AS n FROM "Item" it
        JOIN "Invoice" i ON i."id" = it."invoiceId"
        WHERE i."createdById" = ${userId} GROUP BY it."invoiceId") per_invoice)
        AS "maxItemsPerInvoice"
  `;
  if (!usage) throw new Error("Workspace usage unavailable");
  return usage;
}

export const exceedsWorkspaceLimits = (usage: WorkspaceUsage) =>
  usage.invoices > DEMO_WORKSPACE_LIMITS.invoices ||
  usage.revisions > DEMO_WORKSPACE_LIMITS.revisions ||
  usage.maxItemsPerInvoice > DEMO_WORKSPACE_LIMITS.itemsPerInvoice;

/**
 * Cheap rejection of oversized input BEFORE a transaction is opened. Item
 * counts are deliberately not checked here: the post-write usage measurement
 * covers every operation, including restore, which carries no input.
 */
export function assertDemoInvoiceText(invoice: Partial<Invoice>) {
  const L = DEMO_TEXT_LIMITS;
  const fields: [string, string | undefined, number][] = [
    ["clientName", invoice.clientName, L.clientName],
    ["clientEmail", invoice.clientEmail, L.clientEmail],
    ["description", invoice.description, L.description],
    ["status", invoice.status, L.status],
    ["createdAt", invoice.createdAt, L.createdAt],
    ["paymentDue", invoice.paymentDue, L.paymentDue],
  ];
  for (const [key, address] of [
    ["clientAddress", invoice.clientAddress],
    ["senderAddress", invoice.senderAddress],
  ] as const) {
    if (!address) continue;
    fields.push(
      [`${key}.street`, address.street, L.street],
      [`${key}.city`, address.city, L.city],
      [`${key}.postCode`, address.postCode, L.postCode],
      [`${key}.country`, address.country, L.country],
    );
  }
  for (const [i, item] of (invoice.items ?? []).entries())
    fields.push([`items.${i}.name`, item.name, L.itemName]);
  for (const [field, value, max] of fields) {
    if (typeof value === "string" && value.length > max)
      throw new ValidationException(`${field} exceeds ${max} characters`);
  }
}
