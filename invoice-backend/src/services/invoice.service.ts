import { Invoice, UserIdAndRole } from "../constants/types";
import {
  mapPartialInvoiceToInvoice,
  validateInvoiceData,
  validateInvoiceList,
} from "../utils/utils";
import { inject, injectable, optional } from "inversify";
import { IInvoiceRepo } from "../repositories/InvoiceRepo";
import TYPES from "../constants/identifiers";
import {
  InternalServerException,
  NotFoundException,
  ValidationException,
} from "../config/exception.config";
import type { InvoiceRevisionService } from "./invoiceRevision.service";
import {
  toSnapshot,
  withRecomputedTotals,
  type InvoiceSnapshot,
} from "./invoiceDiff";

@injectable()
export class InvoiceService {
  constructor(
    @inject(TYPES.IInvoiceRepo)
    private readonly invoiceRepo: IInvoiceRepo,
    @inject(TYPES.UserContext)
    private readonly userContext: UserIdAndRole | null,
    @optional()
    @inject(TYPES.InvoiceRevisionService)
    private readonly revisionService: InvoiceRevisionService | null = null,
  ) {}

  getInvoices = async (): Promise<Invoice[]> => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    const { role, id } = this.userContext;

    if (!id) {
      throw new ValidationException("Unauthorized");
    }

    if (role !== "ADMIN") {
      return validateInvoiceList(await this.invoiceRepo.findByUserId(id));
    }

    try {
      const result = await this.invoiceRepo.findAll();
      return validateInvoiceList(result);
    } catch (e) {
      console.error(e);
      throw new InternalServerException("Internal server error");
    }
  };

  getInvoiceById = async (
    invoiceId: string,
  ): Promise<Partial<Invoice> | null> => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }
    const { role, id } = this.userContext;

    if (!id || !role) {
      throw new ValidationException("Unauthorized");
    }

    if (role === "ADMIN") {
      try {
        const result = await this.invoiceRepo.findById(invoiceId);
        if (!result) {
          console.error("role = ADMIN - Invoice not found");
          throw new NotFoundException("Invoice not found");
        }
        return result;
      } catch (e) {
        console.error(e);
        if (e instanceof ValidationException) {
          throw e;
        }
        if (e instanceof NotFoundException) {
          throw e;
        }
        throw new InternalServerException("Internal server error");
      }
    } else {
      try {
        const result = await this.invoiceRepo.findByUserIdAndInvoiceId(
          id,
          role,
          invoiceId,
        );
        if (!result) {
          console.error("role = USER - Invoice not found");
          throw new NotFoundException("Invoice not found");
        }
        return result;
      } catch (e) {
        console.error(e);
        if (e instanceof ValidationException) {
          throw e;
        }
        if (e instanceof NotFoundException) {
          throw e;
        }
        throw new InternalServerException("Internal server error");
      }
    }
  };

  addInvoice = async (invoice: Invoice) => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    try {
      const invoiceWithUserInfo = {
        ...invoice,
        createdById: this.userContext.id,
        createdBy: {
          id: this.userContext.id,
          name: this.userContext.name,
          username: this.userContext.username ?? "",
          role: this.userContext.role,
        },
      };

      const fullInvoice = mapPartialInvoiceToInvoice(invoiceWithUserInfo);
      const createdInvoice = await this.invoiceRepo.create(fullInvoice);
      const validatedData = validateInvoiceData(createdInvoice);

      // Seed revision #1 so the history view is never empty.
      if (this.revisionService) {
        try {
          await this.revisionService.recordIfChanged({
            invoiceId: validatedData.id,
            invoice: validatedData,
            changeType: "create",
            message: "Invoice created",
          });
        } catch (err) {
          console.error("Failed to record initial revision", err);
        }
      }

      return validatedData;
    } catch (e) {
      console.error(e);
      if (e instanceof ValidationException) {
        throw e;
      } else if (e instanceof NotFoundException) {
        throw e;
      } else {
        throw new InternalServerException("Internal server error");
      }
    }
  };

  updateInvoice = async (id: string, invoiceUpdates: Partial<Invoice>) => {
    const oldInvoice = await this.getInvoiceById(id);
    if (!oldInvoice) {
      throw new NotFoundException("Invoice not found");
    }

    try {
      const newInvoiceUnvalidated = { ...oldInvoice, ...invoiceUpdates };
      const validatedInvoice: Partial<Invoice> = validateInvoiceData(
        newInvoiceUnvalidated,
      );

      delete newInvoiceUnvalidated.createdBy;
      delete newInvoiceUnvalidated.createdById;
      const result = await this.invoiceRepo.update(id, validatedInvoice);

      // History is append-only. We record AFTER the write succeeds so that a
      // failed DB write never leaves a misleading revision behind. No-ops
      // (unchanged snapshot) are filtered out inside the revision service.
      if (this.revisionService) {
        try {
          await this.revisionService.recordIfChanged({
            invoiceId: id,
            invoice: result,
            changeType: "edit",
          });
        } catch (err) {
          console.error("Failed to record edit revision", err);
        }
      }

      return result;
    } catch (e) {
      console.error(e);
      if (e instanceof ValidationException) {
        throw e;
      }
      throw new InternalServerException("Internal server error");
    }
  };

  /**
   * Restore an older revision as the current state of the invoice.
   *
   * Append-only semantics: this never mutates or deletes previous history.
   * After the underlying invoice is updated to match the restored snapshot,
   * we record a new revision marked `changeType: "restore"` that references
   * the source revision. Totals are recomputed so a restore cannot introduce
   * stale line-item math.
   */
  restoreRevision = async (invoiceId: string, revisionId: string) => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }
    if (!this.revisionService) {
      throw new InternalServerException("Revision service unavailable");
    }

    const current = (await this.getInvoiceById(invoiceId)) as
      | (Partial<Invoice> & { id?: string })
      | null;
    if (!current) {
      throw new NotFoundException("Invoice not found");
    }

    const revision = await this.revisionService.getRevision(revisionId);
    if (revision.invoiceId !== invoiceId) {
      throw new ValidationException(
        "Revision does not belong to this invoice",
      );
    }

    const restored: InvoiceSnapshot = withRecomputedTotals(revision.snapshot);

    // Preserve item ids for items that still exist on the current invoice so
    // that downstream diff matching is stable. Items that existed in the
    // restored revision but not on the current record get fresh ids.
    const currentSnapshot = toSnapshot(current);
    const currentIds = new Set(currentSnapshot.items.map((i) => i.id));
    const itemsForWrite = restored.items.map((item) => ({
      id: item.id && currentIds.has(item.id) ? item.id : "",
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.total,
    }));

    const writePayload: Partial<Invoice> = {
      clientAddress: restored.clientAddress,
      senderAddress: restored.senderAddress,
      clientEmail: restored.clientEmail,
      clientName: restored.clientName,
      createdAt: restored.createdAt,
      description: restored.description,
      paymentDue: restored.paymentDue,
      paymentTerms: restored.paymentTerms,
      status: restored.status,
      total: restored.total,
      items: itemsForWrite.map((i) => ({
        ...(i.id ? { id: i.id } : {}),
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        total: i.total,
      })),
    };

    const result = await this.invoiceRepo.update(invoiceId, writePayload);

    await this.revisionService.recordIfChanged({
      invoiceId,
      invoice: result,
      changeType: "restore",
      restoredFromRevisionId: revisionId,
      message: `Restored from revision #${revision.revisionNumber}`,
    });

    return result;
  };

  markAsPaid = async (id: string) => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }
    try {
      const result = await this.invoiceRepo.markAsPaid(id);
      return validateInvoiceData(result);
    } catch (e) {
      console.error(e);
      if (e instanceof ValidationException) {
        throw e;
      }
      throw new InternalServerException("Internal server error");
    }
  };

  deleteInvoice = async (invoiceId: string) => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    const { id, role } = this.userContext;
    const invoice = (await this.getInvoiceById(invoiceId)) as Invoice;
    if (invoice.createdById !== id || role !== "ADMIN") {
      throw new ValidationException("Unauthorized");
    }
    try {
      const result = await this.invoiceRepo.delete(invoiceId);
      if (!result) {
        throw new NotFoundException("Invoice not found");
      }
      return result;
    } catch (e) {
      console.error(e);
      throw new InternalServerException("Internal server error");
    }
  };

  deleteAllInvoices = async () => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    const { id, role } = this.userContext;

    if (!id || role !== "ADMIN") {
      throw new ValidationException("Unauthorized");
    }

    try {
      return await this.invoiceRepo.deleteAllInvoices();
    } catch (e) {
      console.error(e);
      throw new InternalServerException("Internal server error");
    }
  };

  deleteInvoicesByUserId = async () => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    const { id, role } = this.userContext;

    if (!id || role !== "ADMIN") {
      throw new ValidationException("Unauthorized");
    }

    try {
      return await this.invoiceRepo.deleteInvoicesByUserId(id);
    } catch (e) {
      console.error(e);
      throw new InternalServerException("Internal server error");
    }
  };
}
