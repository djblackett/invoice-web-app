import { Invoice } from "../constants/types";

export interface IInvoiceRepo {
  findAll: () => Promise<unknown>;
  findById: (id: string) => Promise<unknown>;
  delete: (id: string) => Promise<unknown>;
  markAsPaid: (id: string) => void;
  update: (id: string, invoiceUpdates: Partial<Invoice>) => Promise<unknown>;
  create: (invoice: Invoice) => Promise<unknown>;
}
