import { inject, injectable } from "inversify";
import { Prisma } from "@prisma/client";
import type {
  CreateRevisionInput,
  IInvoiceRevisionRepo,
  StoredRevision,
} from "@/repositories/InvoiceRevisionRepo";
import { DatabaseConnection } from "@/database/prisma.database.connection";
import type { InvoiceSnapshot } from "@/services/invoiceDiff";

function toStored(row: {
  id: string;
  invoiceId: string;
  revisionNumber: number;
  createdAt: Date;
  createdById: string | null;
  changeType: string;
  restoredFromRevisionId: string | null;
  message: string | null;
  snapshot: Prisma.JsonValue;
  createdBy?: { id: string; username: string; name: string | null } | null;
}): StoredRevision {
  return {
    id: row.id,
    invoiceId: row.invoiceId,
    revisionNumber: row.revisionNumber,
    createdAt: row.createdAt,
    createdById: row.createdById,
    changeType: row.changeType as StoredRevision["changeType"],
    restoredFromRevisionId: row.restoredFromRevisionId,
    message: row.message,
    snapshot: row.snapshot as unknown as InvoiceSnapshot,
    createdBy: row.createdBy ?? null,
  };
}

@injectable()
export class PrismaInvoiceRevisionRepository implements IInvoiceRevisionRepo {
  protected prisma;

  constructor(
    @inject(DatabaseConnection) databaseConnection: DatabaseConnection,
  ) {
    this.prisma = databaseConnection.getDatabase();
  }

  async create(input: CreateRevisionInput): Promise<StoredRevision> {
    // Compute next revisionNumber inside a transaction so concurrent writes
    // can't produce duplicate numbers (protected by the unique index).
    const row = await this.prisma.$transaction(async (tx) => {
      const latest = await tx.invoiceRevision.findFirst({
        where: { invoiceId: input.invoiceId },
        orderBy: { revisionNumber: "desc" },
        select: { revisionNumber: true },
      });
      const nextNumber = (latest?.revisionNumber ?? 0) + 1;
      return tx.invoiceRevision.create({
        data: {
          invoiceId: input.invoiceId,
          revisionNumber: nextNumber,
          changeType: input.changeType,
          restoredFromRevisionId: input.restoredFromRevisionId ?? null,
          message: input.message ?? null,
          createdById: input.createdById ?? null,
          snapshot: input.snapshot as unknown as Prisma.InputJsonValue,
        },
        include: {
          createdBy: {
            select: { id: true, username: true, name: true },
          },
        },
      });
    });
    return toStored(row);
  }

  async listByInvoice(invoiceId: string): Promise<StoredRevision[]> {
    const rows = await this.prisma.invoiceRevision.findMany({
      where: { invoiceId },
      orderBy: { revisionNumber: "desc" },
      include: {
        createdBy: { select: { id: true, username: true, name: true } },
      },
    });
    return rows.map(toStored);
  }

  async findById(revisionId: string): Promise<StoredRevision | null> {
    const row = await this.prisma.invoiceRevision.findUnique({
      where: { id: revisionId },
      include: {
        createdBy: { select: { id: true, username: true, name: true } },
      },
    });
    return row ? toStored(row) : null;
  }

  async findLatest(invoiceId: string): Promise<StoredRevision | null> {
    const row = await this.prisma.invoiceRevision.findFirst({
      where: { invoiceId },
      orderBy: { revisionNumber: "desc" },
      include: {
        createdBy: { select: { id: true, username: true, name: true } },
      },
    });
    return row ? toStored(row) : null;
  }
}
