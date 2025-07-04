import { inject, injectable } from "inversify";
import { IDatabaseConnection } from "@/database/database.connection";
import TYPES from "@/constants/identifiers";
import { UserIdAndRole } from "@/constants/types";
import {
  ValidationException,
  NotFoundException,
} from "@/config/exception.config";
import * as jsondiffpatch from "jsondiffpatch";

export interface InvoiceRevisionData {
  id: string;
  invoiceId: string;
  createdAt: Date;
  createdBy: {
    id: string;
    username: string;
    name?: string | undefined;
  };
  revisionNumber: number;
  changeType: string;
  description?: string | undefined;
  jsonDiff?: any;
  fullSnapshot: any;
}

export interface RevisionFilters {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  changeType?: string;
}

@injectable()
export class RevisionService {
  protected prisma;
  private diffPatcher: jsondiffpatch.DiffPatcher;

  constructor(
    @inject(TYPES.DatabaseConnection)
    databaseConnection: IDatabaseConnection,
    @inject(TYPES.UserContext)
    private readonly userContext: UserIdAndRole | null,
  ) {
    this.prisma = databaseConnection.getDatabase();
    this.diffPatcher = jsondiffpatch.create({
      objectHash: (obj: any) => obj.id || obj._id || JSON.stringify(obj),
      arrays: {
        detectMove: true,
        includeValueOnMove: false,
      },
    });
  }

  async createRevision(
    invoiceId: string,
    previousData: any,
    currentData: any,
    changeType: "create" | "update" | "status_change",
    description?: string,
  ): Promise<void> {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    // Get the next revision number for this invoice
    const lastRevision = await this.prisma.invoiceRevision.findFirst({
      where: { invoiceId },
      orderBy: { revisionNumber: "desc" },
    });

    const revisionNumber = (lastRevision?.revisionNumber || 0) + 1;

    // Create JSON diff (null for initial creation)
    const jsonDiff =
      changeType === "create"
        ? null
        : this.diffPatcher.diff(previousData, currentData);

    await this.prisma.invoiceRevision.create({
      data: {
        invoiceId,
        createdById: this.userContext.id,
        revisionNumber,
        changeType,
        jsonDiff: jsonDiff ? JSON.stringify(jsonDiff) : null,
        fullSnapshot: JSON.stringify(currentData),
        description: description || null,
      },
    });
  }

  async getInvoiceRevisions(
    invoiceId: string,
    filters?: RevisionFilters,
  ): Promise<InvoiceRevisionData[]> {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    // Check if user has access to this invoice
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { createdById: true },
    });

    if (!invoice) {
      throw new NotFoundException("Invoice not found");
    }

    if (
      this.userContext.role !== "ADMIN" &&
      invoice.createdById !== this.userContext.id
    ) {
      throw new ValidationException(
        "Unauthorized to view revisions for this invoice",
      );
    }

    const whereClause: any = { invoiceId };

    if (filters) {
      if (filters.startDate || filters.endDate) {
        whereClause.createdAt = {};
        if (filters.startDate) {
          whereClause.createdAt.gte = filters.startDate;
        }
        if (filters.endDate) {
          whereClause.createdAt.lte = filters.endDate;
        }
      }

      if (filters.userId) {
        whereClause.createdById = filters.userId;
      }

      if (filters.changeType) {
        whereClause.changeType = filters.changeType;
      }
    }

    const revisions = await this.prisma.invoiceRevision.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
      orderBy: { revisionNumber: "desc" },
    });

    return revisions.map((revision) => ({
      id: revision.id,
      invoiceId: revision.invoiceId,
      createdAt: revision.createdAt,
      createdBy: {
        id: revision.createdBy.id,
        username: revision.createdBy.username,
        name: revision.createdBy.name || undefined,
      },
      revisionNumber: revision.revisionNumber,
      changeType: revision.changeType,
      description: revision.description || undefined,
      jsonDiff: revision.jsonDiff ? JSON.parse(revision.jsonDiff) : null,
      fullSnapshot: JSON.parse(revision.fullSnapshot),
    }));
  }

  async restoreInvoiceToRevision(
    invoiceId: string,
    revisionNumber: number,
  ): Promise<any> {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    // Check if user has access to this invoice
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { createdById: true },
    });

    if (!invoice) {
      throw new NotFoundException("Invoice not found");
    }

    if (
      this.userContext.role !== "ADMIN" &&
      invoice.createdById !== this.userContext.id
    ) {
      throw new ValidationException("Unauthorized to restore this invoice");
    }

    // Get the revision to restore to
    const targetRevision = await this.prisma.invoiceRevision.findUnique({
      where: {
        invoiceId_revisionNumber: {
          invoiceId,
          revisionNumber,
        },
      },
    });

    if (!targetRevision) {
      throw new NotFoundException("Revision not found");
    }

    const snapshotData = JSON.parse(targetRevision.fullSnapshot);

    // Get current invoice data for creating a new revision
    const currentInvoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        items: true,
        clientAddress: true,
        senderAddress: true,
        createdBy: true,
      },
    });

    if (!currentInvoice) {
      throw new NotFoundException("Current invoice not found");
    }

    // Create a revision for the current state before restoring
    await this.createRevision(
      invoiceId,
      currentInvoice,
      snapshotData,
      "update",
      `Restored to revision ${revisionNumber}`,
    );

    // Restore the invoice using a transaction
    return await this.prisma.$transaction(async (prisma) => {
      // Delete current items
      await prisma.item.deleteMany({
        where: { invoiceId },
      });

      // Build update data object
      const updateData: any = {
        description: snapshotData.description,
        clientEmail: snapshotData.clientEmail,
        clientName: snapshotData.clientName,
        paymentDue: snapshotData.paymentDue,
        paymentTerms: snapshotData.paymentTerms,
        status: snapshotData.status,
        total: snapshotData.total,
        items: {
          createMany: {
            data:
              snapshotData.items?.map((item: any) => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                total: item.total,
              })) || [],
          },
        },
      };

      // Only add address updates if they exist
      if (snapshotData.clientAddress) {
        updateData.clientAddress = {
          update: {
            street: snapshotData.clientAddress.street,
            city: snapshotData.clientAddress.city,
            postCode: snapshotData.clientAddress.postCode,
            country: snapshotData.clientAddress.country,
          },
        };
      }

      if (snapshotData.senderAddress) {
        updateData.senderAddress = {
          update: {
            street: snapshotData.senderAddress.street,
            city: snapshotData.senderAddress.city,
            postCode: snapshotData.senderAddress.postCode,
            country: snapshotData.senderAddress.country,
          },
        };
      }

      // Update invoice with snapshot data
      const restoredInvoice = await prisma.invoice.update({
        where: { id: invoiceId },
        data: updateData,
        include: {
          items: true,
          clientAddress: true,
          senderAddress: true,
          createdBy: true,
        },
      });

      return restoredInvoice;
    });
  }

  async getRevisionDiff(
    invoiceId: string,
    fromRevision: number,
    toRevision: number,
  ): Promise<any> {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    // Check if user has access to this invoice
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { createdById: true },
    });

    if (!invoice) {
      throw new NotFoundException("Invoice not found");
    }

    if (
      this.userContext.role !== "ADMIN" &&
      invoice.createdById !== this.userContext.id
    ) {
      throw new ValidationException(
        "Unauthorized to view revisions for this invoice",
      );
    }

    const [fromRev, toRev] = await Promise.all([
      this.prisma.invoiceRevision.findUnique({
        where: {
          invoiceId_revisionNumber: {
            invoiceId,
            revisionNumber: fromRevision,
          },
        },
      }),
      this.prisma.invoiceRevision.findUnique({
        where: {
          invoiceId_revisionNumber: {
            invoiceId,
            revisionNumber: toRevision,
          },
        },
      }),
    ]);

    if (!fromRev || !toRev) {
      throw new NotFoundException("One or both revisions not found");
    }

    const fromData = JSON.parse(fromRev.fullSnapshot);
    const toData = JSON.parse(toRev.fullSnapshot);

    return this.diffPatcher.diff(fromData, toData);
  }
}
