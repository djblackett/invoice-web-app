import type { InvoiceSnapshot } from "@/services/invoiceDiff";

export type RevisionChangeType = "create" | "edit" | "restore";

export interface CreateRevisionInput {
  invoiceId: string;
  createdById?: string | null;
  changeType: RevisionChangeType;
  restoredFromRevisionId?: string | null;
  message?: string | null;
  snapshot: InvoiceSnapshot;
}

export interface StoredRevision {
  id: string;
  invoiceId: string;
  revisionNumber: number;
  createdAt: Date;
  createdById: string | null;
  changeType: RevisionChangeType;
  restoredFromRevisionId: string | null;
  message: string | null;
  snapshot: InvoiceSnapshot;
  createdBy: {
    id: string;
    username: string;
    name: string | null;
  } | null;
}

/**
 * Append-only store for invoice revisions. Implementations MUST NOT expose a
 * way to update or delete a revision row — history is the source of truth.
 */
export interface IInvoiceRevisionRepo {
  create(input: CreateRevisionInput): Promise<StoredRevision>;
  listByInvoice(invoiceId: string): Promise<StoredRevision[]>;
  findById(revisionId: string): Promise<StoredRevision | null>;
  /** Returns the most recent revision for the invoice, if any. */
  findLatest(invoiceId: string): Promise<StoredRevision | null>;
}
