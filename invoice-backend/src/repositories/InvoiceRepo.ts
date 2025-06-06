import type { Role } from "@prisma/client";
import type { Invoice, InvoiceWithCreatedBy } from "../constants/types";

export interface IInvoiceRepo {
  findAll: () => Promise<unknown>;
  findByUserId: (userId: string) => Promise<unknown>;
  findById: (id: string) => Promise<unknown>;
  findByUserIdAndInvoiceId: (
    userId: string,
    role: Role,
    invoiceId: string,
  ) => Promise<unknown>;
  delete: (id: string) => Promise<boolean>;
  deleteAllInvoices: () => Promise<unknown>;
  deleteInvoicesByUserId: (userId: string) => Promise<unknown>;
  markAsPaid: (id: string, updatedById: string) => Promise<unknown>;
  update: (id: string, invoiceUpdates: Partial<Invoice>, updatedById: string) => Promise<unknown>;
  create: (invoice: InvoiceWithCreatedBy) => Promise<unknown>;
  getRevisionsForInvoice: (invoiceId: string, startDate?: string, endDate?: string, userId?: string) => Promise<unknown>;
  getRestoredInvoiceFromRevision: (revisionId: string) => Promise<unknown>;
}
