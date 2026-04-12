/**
 * Human-readable formatters for revision display. Kept pure so they can be
 * unit-tested without touching React/Apollo.
 */

const FIELD_LABELS: Record<string, string> = {
  clientEmail: "Client email",
  clientName: "Client name",
  createdAt: "Invoice date",
  description: "Description",
  paymentDue: "Payment due",
  paymentTerms: "Payment terms",
  status: "Status",
  total: "Total",
  name: "Item name",
  price: "Price",
  quantity: "Quantity",
  clientAddress: "Client address",
  senderAddress: "Sender address",
  street: "Street",
  city: "City",
  postCode: "Post code",
  country: "Country",
};

const MONETARY_FIELDS = new Set(["price", "total"]);

export function fieldLabel(name: string): string {
  return FIELD_LABELS[name] ?? name;
}

export function formatValue(
  field: string,
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined || value === "") return "—";
  if (MONETARY_FIELDS.has(field) || field === "total") {
    const num = typeof value === "number" ? value : Number(value);
    if (!Number.isNaN(num)) {
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(num);
    }
  }
  if (field === "paymentTerms") {
    const num = typeof value === "number" ? value : Number(value);
    if (!Number.isNaN(num)) return `Net ${num} days`;
  }
  return String(value);
}

/**
 * Format a UTC ISO timestamp (or any parseable date string) into a
 * reviewer-friendly "12 Apr 2026, 14:03" form. Returns the raw value if
 * parsing fails so we never blow up on odd input.
 */
export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Short headline for a revision — used as the clickable label in the
 * timeline. We combine the change-type badge (rendered separately) with a
 * short label and fall back to the author if no message was provided.
 */
export function revisionHeadline(revision: {
  changeType: string;
  message: string | null;
  revisionNumber: number;
  createdBy: { name: string | null; username: string } | null;
}): string {
  if (revision.message && revision.message.trim() !== "") {
    return revision.message;
  }
  switch (revision.changeType) {
    case "create":
      return "Invoice created";
    case "restore":
      return "Restored from earlier revision";
    case "edit":
    default: {
      const who =
        revision.createdBy?.name ??
        revision.createdBy?.username ??
        "Someone";
      return `${who} edited the invoice`;
    }
  }
}
