import type { DbClient } from "../database/database.connection";
import type { Invoice, Item } from "../constants/types";
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

// PROVISIONAL numeric bounds; generous for a portfolio demo.
export const DEMO_INPUT_LIMITS = {
  price: 1_000_000,
  quantity: 10_000,
  paymentTerms: 365,
  recordIdLength: 64, // `RT3080-<uuid>` is 43; revision IDs are UUIDs
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

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const RECORD_ID = /^[A-Za-z0-9-]+$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const present = (value: unknown) => value !== undefined && value !== null;
const definedOnly = (fields: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));

function text(field: string, value: unknown): string {
  if (typeof value !== "string")
    throw new ValidationException(`${field} must be text`);
  return value;
}
const optionalText = (field: string, value: unknown) =>
  present(value) ? text(field, value) : undefined;

function bounded(
  field: string,
  value: unknown,
  max: number,
  integer: boolean,
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > max ||
    (integer && !Number.isInteger(value))
  )
    throw new ValidationException(`${field} is out of range`);
  return value;
}

/** Bounds an invoice or revision ID before it reaches any query. */
export function assertDemoRecordId(field: string, value: unknown): string {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > DEMO_INPUT_LIMITS.recordIdLength ||
    !RECORD_ID.test(value)
  )
    throw new ValidationException(`${field} is invalid`);
  return value;
}

function prepareAddress(field: string, value: unknown) {
  if (!present(value)) return undefined;
  if (!isRecord(value)) throw new ValidationException(`${field} is invalid`);
  const { street, city, postCode, country } = value;
  // Omitted fields stay omitted, so an edit keeps the stored value.
  return definedOnly({
    street: optionalText(`${field}.street`, street),
    city: optionalText(`${field}.city`, city),
    postCode: optionalText(`${field}.postCode`, postCode),
    country: optionalText(`${field}.country`, country),
  });
}

function prepareItems(value: unknown): Item[] | undefined {
  if (!present(value)) return undefined;
  if (!Array.isArray(value))
    throw new ValidationException("items must be a list");
  if (value.length > DEMO_WORKSPACE_LIMITS.itemsPerInvoice)
    throw new ValidationException(
      `items exceeds ${DEMO_WORKSPACE_LIMITS.itemsPerInvoice} entries`,
    );
  return value.map((item: unknown, i): Item => {
    if (!isRecord(item)) throw new ValidationException(`items.${i} is invalid`);
    const { id, name, price, quantity } = item;
    if (present(id) && id !== "" && (typeof id !== "string" || !UUID.test(id)))
      throw new ValidationException(`items.${i}.id is invalid`);
    return {
      ...(typeof id === "string" && id !== "" ? { id } : {}),
      name: text(`items.${i}.name`, name ?? ""),
      price: bounded(
        `items.${i}.price`,
        price ?? 0,
        DEMO_INPUT_LIMITS.price,
        false,
      ),
      quantity: bounded(
        `items.${i}.quantity`,
        quantity ?? 0,
        DEMO_INPUT_LIMITS.quantity,
        true,
      ),
      total: undefined, // recomputed by the service
    };
  });
}

/**
 * Pure, database-free preparation of temporary-session invoice input, run
 * BEFORE the coordinator opens a transaction. It rebuilds the input from an
 * allowlist, so `id`, totals and ownership fields never arrive (totals are
 * recomputed by the service). Item IDs must be UUID-shaped; whether one
 * belongs to the visitor's invoice is decided in the transaction, where
 * unknown IDs are ignored. Errors name only the offending field, never data.
 */
export function prepareDemoInvoiceInput(input: unknown): Partial<Invoice> {
  if (!isRecord(input)) throw new ValidationException("Invalid invoice input");
  const invoice = definedOnly({
    clientName: optionalText("clientName", input["clientName"]),
    clientEmail: optionalText("clientEmail", input["clientEmail"]),
    description: optionalText("description", input["description"]),
    status: optionalText("status", input["status"]),
    createdAt: optionalText("createdAt", input["createdAt"]),
    paymentDue: optionalText("paymentDue", input["paymentDue"]),
    paymentTerms: present(input["paymentTerms"])
      ? bounded(
          "paymentTerms",
          input["paymentTerms"],
          DEMO_INPUT_LIMITS.paymentTerms,
          true,
        )
      : undefined,
    clientAddress: prepareAddress("clientAddress", input["clientAddress"]),
    senderAddress: prepareAddress("senderAddress", input["senderAddress"]),
    items: prepareItems(input["items"]),
  }) as Partial<Invoice>;
  assertDemoInvoiceText(invoice);
  return invoice;
}
