import { Invoice } from "../constants/types";

export interface IInvoiceRepo {
  findAll: () => Promise<unknown>;
  findById: (id: string) => Promise<unknown>;
  delete: (id: string) => Promise<boolean>;
  markAsPaid: (id: string) => Promise<unknown>;
  update: (id: string, invoiceUpdates: Partial<Invoice>) => Promise<unknown>;
  create: (invoice: Invoice) => Promise<unknown>;
}
