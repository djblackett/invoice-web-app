import { Invoice, InvoiceWithCreatedBy } from "../constants/types";
import { Invoice as InvoiceModel } from "@prisma/client";

export interface IInvoiceRepo {
  findAll: () => Promise<unknown>;
  findByUserId: (userId: string) => Promise<unknown>;
  findById: (id: string) => Promise<unknown>;
  findByUserIdAndInvoiceId: (
    userId: string,
    invoiceId: string,
  ) => Promise<unknown>;
  delete: (id: string) => Promise<boolean>;
  deleteAllInvoices: () => Promise<unknown>;
  markAsPaid: (id: string) => Promise<unknown>;
  update: (id: string, invoiceUpdates: Partial<Invoice>) => Promise<unknown>;
  create: (invoice: InvoiceWithCreatedBy) => Promise<unknown>;
}
