import { requireDemoMutationAllowed } from "./demoSessionPolicy";
import { inject, injectable } from "inversify";
import type { IInvoiceRepo } from "@/repositories/InvoiceRepo";
import { getAuthorizedInvoice } from "./authorizedInvoice";
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
 * listing, and diff computation. Reads are authorized against the parent
 * invoice before loading snapshots. It never mutates invoices
 * directly; the orchestration for restore lives in {@link InvoiceService}.
 */
@injectable()
export class InvoiceRevisionService {
  constructor(
    @inject(TYPES.IInvoiceRevisionRepo)
    private readonly revisionRepo: IInvoiceRevisionRepo,
    @inject(TYPES.UserContext)
    private readonly userContext: UserIdAndRole | null,
    @inject(TYPES.IInvoiceRepo)
    private readonly invoiceRepo: IInvoiceRepo,
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
    requireDemoMutationAllowed(this.userContext);
    await getAuthorizedInvoice(
      this.invoiceRepo,
      this.userContext,
      params.invoiceId,
    );
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
    await getAuthorizedInvoice(this.invoiceRepo, this.userContext, invoiceId);
    return this.revisionRepo.listByInvoice(invoiceId);
  };

  getRevision = async (revisionId: string): Promise<StoredRevision> => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }
    if (!this.userContext.id || !this.userContext.role) {
      throw new ValidationException("Unauthorized");
    }
    const invoiceId = await this.revisionRepo.findInvoiceId(revisionId);
    if (!invoiceId) {
      throw new NotFoundException("Revision not found");
    }
    try {
      await getAuthorizedInvoice(this.invoiceRepo, this.userContext, invoiceId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Missing and inaccessible revision IDs share the same public contract.
        throw new NotFoundException("Revision not found");
      }
      throw error;
    }
    const revision = await this.revisionRepo.findById(revisionId);
    if (!revision || revision.invoiceId !== invoiceId) {
      throw new NotFoundException("Revision not found");
    }
    return revision;
  };

  /**
   * Diff two revisions. If `fromRevisionId` is null, diffs against the empty
   * state (useful for "initial revision" display). Both revisions must be
   * accessible to the caller and belong to the same invoice.
   */
  getDiff = async (
    fromRevisionId: string | null,
    toRevisionId: string,
  ): Promise<InvoiceDiff> => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }
    const to = await this.getRevision(toRevisionId);
    let fromSnapshot: InvoiceSnapshot | null = null;
    if (fromRevisionId) {
      const from = await this.getRevision(fromRevisionId);
      if (from.invoiceId !== to.invoiceId) {
        throw new ValidationException("Revisions belong to different invoices");
      }
      fromSnapshot = from.snapshot;
    }
    return diffSnapshots(fromSnapshot, to.snapshot, {
      fromRevisionId,
      toRevisionId,
    });
  };
}
