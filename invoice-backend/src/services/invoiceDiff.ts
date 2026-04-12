/**
 * Pure, side-effect-free diff utilities for invoice snapshots.
 *
 * A "snapshot" is a normalized plain object containing the full invoice state
 * at a point in time (see {@link InvoiceSnapshot}). These helpers are used by
 * the revision service to:
 *   1. Detect no-op edits (so we don't write a meaningless revision row).
 *   2. Produce structured diffs between any two revisions for the UI.
 */

export interface SnapshotAddress {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface SnapshotItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface InvoiceSnapshot {
  clientAddress: SnapshotAddress;
  senderAddress: SnapshotAddress;
  clientEmail: string;
  clientName: string;
  createdAt: string;
  description: string;
  items: SnapshotItem[];
  paymentDue: string;
  paymentTerms: number;
  status: string;
  total: number;
}

export interface ScalarFieldChange {
  field: string;
  before: string | number | null;
  after: string | number | null;
}

export interface AddressFieldChange {
  key: "street" | "city" | "postCode" | "country";
  before: string;
  after: string;
}

export interface AddressChange {
  field: "clientAddress" | "senderAddress";
  changes: AddressFieldChange[];
}

export interface ItemChange {
  itemKey: string;
  changeType: "added" | "removed" | "modified";
  before: SnapshotItem | null;
  after: SnapshotItem | null;
  fieldChanges: ScalarFieldChange[];
}

export interface InvoiceDiff {
  fromRevisionId: string | null;
  toRevisionId: string;
  fieldChanges: ScalarFieldChange[];
  addressChanges: AddressChange[];
  itemChanges: ItemChange[];
}

const SCALAR_FIELDS: Array<
  keyof Omit<
    InvoiceSnapshot,
    "items" | "clientAddress" | "senderAddress"
  >
> = [
  "clientEmail",
  "clientName",
  "createdAt",
  "description",
  "paymentDue",
  "paymentTerms",
  "status",
  "total",
];

const ADDRESS_KEYS: Array<AddressFieldChange["key"]> = [
  "street",
  "city",
  "postCode",
  "country",
];

const MONETARY_EPSILON = 0.0001;

function numbersEqual(a: number, b: number): boolean {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return a === b;
  return Math.abs(a - b) < MONETARY_EPSILON;
}

function scalarsEqual(a: unknown, b: unknown): boolean {
  if (typeof a === "number" && typeof b === "number") return numbersEqual(a, b);
  return a === b;
}

function diffAddress(
  field: AddressChange["field"],
  before: SnapshotAddress,
  after: SnapshotAddress,
): AddressChange | null {
  const changes: AddressFieldChange[] = [];
  for (const key of ADDRESS_KEYS) {
    const b = before?.[key] ?? "";
    const a = after?.[key] ?? "";
    if (b !== a) {
      changes.push({ key, before: b, after: a });
    }
  }
  return changes.length > 0 ? { field, changes } : null;
}

function diffItem(
  before: SnapshotItem | null,
  after: SnapshotItem | null,
): ScalarFieldChange[] {
  const fields: Array<keyof SnapshotItem> = ["name", "price", "quantity", "total"];
  const changes: ScalarFieldChange[] = [];
  for (const f of fields) {
    const b = before ? before[f] : null;
    const a = after ? after[f] : null;
    if (!scalarsEqual(b, a)) {
      changes.push({
        field: f,
        before: (b as string | number | null) ?? null,
        after: (a as string | number | null) ?? null,
      });
    }
  }
  return changes;
}

/**
 * Match items between two snapshots, preferring a stable id. Items without an
 * id (or with a colliding id) fall back to name-based matching; this keeps
 * renames/edits from showing up as remove+add when the id is missing.
 */
function pairItems(
  before: SnapshotItem[],
  after: SnapshotItem[],
): Array<{
  key: string;
  before: SnapshotItem | null;
  after: SnapshotItem | null;
}> {
  const pairs: Array<{
    key: string;
    before: SnapshotItem | null;
    after: SnapshotItem | null;
  }> = [];
  const usedBefore = new Set<number>();
  const usedAfter = new Set<number>();

  // 1) id-based pairing — strongest signal for stable matching.
  before.forEach((b, bi) => {
    if (!b.id) return;
    const aIdx = after.findIndex(
      (a, ai) => !usedAfter.has(ai) && a.id === b.id,
    );
    if (aIdx >= 0) {
      usedAfter.add(aIdx);
      usedBefore.add(bi);
      pairs.push({ key: b.id, before: b, after: after[aIdx]! });
    }
  });

  // 2) name-based pairing for items that didn't match by id. Handles the
  // legacy case where items had new ids generated on every save.
  before.forEach((b, bi) => {
    if (usedBefore.has(bi)) return;
    const aIdx = after.findIndex(
      (a, ai) => !usedAfter.has(ai) && a.name === b.name,
    );
    if (aIdx >= 0) {
      usedAfter.add(aIdx);
      usedBefore.add(bi);
      pairs.push({
        key: b.id || `name:${b.name}`,
        before: b,
        after: after[aIdx]!,
      });
    }
  });

  // 3) remaining before → removed
  before.forEach((b, bi) => {
    if (usedBefore.has(bi)) return;
    pairs.push({
      key: b.id || `name:${b.name}`,
      before: b,
      after: null,
    });
  });

  // 4) remaining after → added
  after.forEach((a, ai) => {
    if (usedAfter.has(ai)) return;
    pairs.push({
      key: a.id || `name:${a.name}`,
      before: null,
      after: a,
    });
  });

  return pairs;
}

export function diffSnapshots(
  before: InvoiceSnapshot | null,
  after: InvoiceSnapshot,
  ids: { fromRevisionId: string | null; toRevisionId: string },
): InvoiceDiff {
  const fieldChanges: ScalarFieldChange[] = [];
  const addressChanges: AddressChange[] = [];
  const itemChanges: ItemChange[] = [];

  if (!before) {
    // Initial revision: every field is an "add" compared to nothing.
    for (const f of SCALAR_FIELDS) {
      fieldChanges.push({
        field: f,
        before: null,
        after: after[f] as string | number,
      });
    }
    const clientInitial = diffAddress(
      "clientAddress",
      { street: "", city: "", postCode: "", country: "" },
      after.clientAddress,
    );
    if (clientInitial) addressChanges.push(clientInitial);
    const senderInitial = diffAddress(
      "senderAddress",
      { street: "", city: "", postCode: "", country: "" },
      after.senderAddress,
    );
    if (senderInitial) addressChanges.push(senderInitial);
    for (const item of after.items) {
      itemChanges.push({
        itemKey: item.id || `name:${item.name}`,
        changeType: "added",
        before: null,
        after: item,
        fieldChanges: [],
      });
    }
    return { ...ids, fieldChanges, addressChanges, itemChanges };
  }

  for (const f of SCALAR_FIELDS) {
    const b = before[f];
    const a = after[f];
    if (!scalarsEqual(b, a)) {
      fieldChanges.push({
        field: f,
        before: b as string | number | null,
        after: a as string | number | null,
      });
    }
  }

  const clientDelta = diffAddress(
    "clientAddress",
    before.clientAddress,
    after.clientAddress,
  );
  if (clientDelta) addressChanges.push(clientDelta);
  const senderDelta = diffAddress(
    "senderAddress",
    before.senderAddress,
    after.senderAddress,
  );
  if (senderDelta) addressChanges.push(senderDelta);

  const pairs = pairItems(before.items, after.items);
  for (const pair of pairs) {
    if (pair.before && !pair.after) {
      itemChanges.push({
        itemKey: pair.key,
        changeType: "removed",
        before: pair.before,
        after: null,
        fieldChanges: [],
      });
    } else if (!pair.before && pair.after) {
      itemChanges.push({
        itemKey: pair.key,
        changeType: "added",
        before: null,
        after: pair.after,
        fieldChanges: [],
      });
    } else if (pair.before && pair.after) {
      const changes = diffItem(pair.before, pair.after);
      if (changes.length > 0) {
        itemChanges.push({
          itemKey: pair.key,
          changeType: "modified",
          before: pair.before,
          after: pair.after,
          fieldChanges: changes,
        });
      }
    }
  }

  return { ...ids, fieldChanges, addressChanges, itemChanges };
}

/** True if the two snapshots represent the same invoice state. */
export function snapshotsEqual(
  a: InvoiceSnapshot,
  b: InvoiceSnapshot,
): boolean {
  const d = diffSnapshots(a, b, {
    fromRevisionId: null,
    toRevisionId: "probe",
  });
  return (
    d.fieldChanges.length === 0 &&
    d.addressChanges.length === 0 &&
    d.itemChanges.length === 0
  );
}

/**
 * Normalize an invoice-shaped object (Prisma result or partial) to an
 * {@link InvoiceSnapshot}. Accepts Decimal/string/number for money fields.
 */
export function toSnapshot(input: unknown): InvoiceSnapshot {
  const src = (input ?? {}) as Record<string, unknown>;
  const addr = (key: string): SnapshotAddress => {
    const raw = (src[key] ?? {}) as Record<string, unknown>;
    return {
      street: typeof raw["street"] === "string" ? raw["street"] : "",
      city: typeof raw["city"] === "string" ? raw["city"] : "",
      postCode: typeof raw["postCode"] === "string" ? raw["postCode"] : "",
      country: typeof raw["country"] === "string" ? raw["country"] : "",
    };
  };
  const num = (v: unknown): number => {
    if (typeof v === "number") return v;
    if (typeof v === "string") return Number(v);
    if (v && typeof (v as { toNumber?: () => number }).toNumber === "function") {
      return (v as { toNumber: () => number }).toNumber();
    }
    return 0;
  };
  const items = Array.isArray(src["items"])
    ? (src["items"] as Array<Record<string, unknown>>).map((it) => ({
        id: typeof it["id"] === "string" ? it["id"] : "",
        name: typeof it["name"] === "string" ? it["name"] : "",
        price: num(it["price"]),
        quantity: num(it["quantity"]),
        total: num(it["total"]),
      }))
    : [];
  return {
    clientAddress: addr("clientAddress"),
    senderAddress: addr("senderAddress"),
    clientEmail: typeof src["clientEmail"] === "string" ? src["clientEmail"] : "",
    clientName: typeof src["clientName"] === "string" ? src["clientName"] : "",
    createdAt: typeof src["createdAt"] === "string" ? src["createdAt"] : "",
    description: typeof src["description"] === "string" ? src["description"] : "",
    items,
    paymentDue: typeof src["paymentDue"] === "string" ? src["paymentDue"] : "",
    paymentTerms: num(src["paymentTerms"]),
    status: typeof src["status"] === "string" ? src["status"] : "",
    total: num(src["total"]),
  };
}

/**
 * Recompute invoice-level totals (line-item totals + invoice total) so that a
 * restored snapshot can't have stale/inconsistent totals. Does not mutate the
 * input; returns a new snapshot.
 */
export function withRecomputedTotals(snapshot: InvoiceSnapshot): InvoiceSnapshot {
  const items = snapshot.items.map((item) => ({
    ...item,
    total: round2(item.price * item.quantity),
  }));
  const total = round2(items.reduce((sum, i) => sum + i.total, 0));
  return { ...snapshot, items, total };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
