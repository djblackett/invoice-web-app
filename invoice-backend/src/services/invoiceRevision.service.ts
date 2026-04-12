import { inject, injectable } from "inversify";
import TYPES from "@/constants/identifiers";
import type {
  IInvoiceRevisionRepo,
  RevisionChangeType,
  StoredRevision,
} from "@/repositories/InvoiceRevisionRepo";
import {
  diffSnapshots,
  snapshotsEqual,
  toSnapshot,
  type InvoiceDiff,
  type InvoiceSnapshot,
} from "./invoiceDiff";
import type { UserIdAndRole } from "@/constants/types";
import {
  NotFoundException,
  ValidationException,
} from "@/config/exception.config";

export interface RecordParams {
  invoiceId: string;
  invoice: unknown;
  changeType: RevisionChangeType;
  restoredFromRevisionId?: string | null;
  message?: string | null;
}

/**
 * Owns the revision history for invoices: snapshot capture, no-op detection,
 * listing, and diff computation. Pure-ish — the only state it touches is the
 * revision store (via {@link IInvoiceRevisionRepo}). It never mutates invoices
 * directly; the orchestration for restore lives in {@link InvoiceService}.
 */
@injectable()
export class InvoiceRevisionService {
  constructor(
    @inject(TYPES.IInvoiceRevisionRepo)
    private readonly revisionRepo: IInvoiceRevisionRepo,
    @inject(TYPES.UserContext)
    private readonly userContext: UserIdAndRole | null,
  ) {}

  /**
   * Record a revision iff the snapshot differs from the current head. Returns
   * the new revision, or `null` for no-op edits.
   *
   * `changeType === "create"` and `"restore"` always record (the caller is
   * asserting something happened). For `"edit"` we compare against the latest
   * snapshot and skip if unchanged.
   */
  recordIfChanged = async (
    params: RecordParams,
  ): Promise<StoredRevision | null> => {
    const nextSnapshot = toSnapshot(params.invoice);
    const latest = await this.revisionRepo.findLatest(params.invoiceId);

    if (
      params.changeType === "edit" &&
      latest &&
      snapshotsEqual(latest.snapshot, nextSnapshot)
    ) {
      return null;
    }

    return this.revisionRepo.create({
      invoiceId: params.invoiceId,
      createdById: this.userContext?.id ?? null,
      changeType: params.changeType,
      restoredFromRevisionId: params.restoredFromRevisionId ?? null,
      message: params.message ?? null,
      snapshot: nextSnapshot,
    });
  };

  listRevisions = async (invoiceId: string): Promise<StoredRevision[]> => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }
    return this.revisionRepo.listByInvoice(invoiceId);
  };

  getRevision = async (revisionId: string): Promise<StoredRevision> => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }
    const revision = await this.revisionRepo.findById(revisionId);
    if (!revision) {
      throw new NotFoundException("Revision not found");
    }
    return revision;
  };

  /**
   * Diff two revisions. If `fromRevisionId` is null, diffs against the empty
   * state (useful for "initial revision" display). If the two revisions
   * belong to different invoices, we still diff them — callers should
   * enforce same-invoice if it matters to them.
   */
  getDiff = async (
    fromRevisionId: string | null,
    toRevisionId: string,
  ): Promise<InvoiceDiff> => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }
    const to = await this.revisionRepo.findById(toRevisionId);
    if (!to) throw new NotFoundException("Revision not found");
    let fromSnapshot: InvoiceSnapshot | null = null;
    if (fromRevisionId) {
      const from = await this.revisionRepo.findById(fromRevisionId);
      if (!from) throw new NotFoundException("Revision not found");
      fromSnapshot = from.snapshot;
    }
    return diffSnapshots(fromSnapshot, to.snapshot, {
      fromRevisionId,
      toRevisionId,
    });
  };
}
