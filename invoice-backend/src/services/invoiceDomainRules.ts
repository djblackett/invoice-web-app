import { randomInt } from "node:crypto";
import type { Invoice } from "../constants/types";

/** Use the product's two-uppercase-letter/four-digit invoice convention. */
export function generateInvoiceId(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return `${letters[randomInt(26)]}${letters[randomInt(26)]}${randomInt(10000).toString().padStart(4, "0")}`;
}

/** Canonicalize money before validation/persistence, without mutating inputs. */
export function withCalculatedTotals<T extends Partial<Invoice>>(invoice: T) {
  const items = (invoice.items ?? []).map((item) => {
    const quantity = Number(item.quantity ?? 0);
    const price = Number(item.price ?? 0);
    return { ...item, quantity, price, total: quantity * price };
  });
  return {
    ...invoice,
    items,
    total: items.reduce((sum, item) => sum + item.total, 0),
  };
}
