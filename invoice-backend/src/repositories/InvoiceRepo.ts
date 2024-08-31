import { Invoice } from "../constants/types";

export interface IInvoiceRepo {
  findAll: () => Promise<unknown>
  findById: (id: string) => Promise<Invoice> | Invoice;
  deleteInvoice: (id: string) => Promise<unknown>;
  markAsPaid: (id: string) => void;
  editInvoice: (id: string, invoiceUpdates: Partial<Invoice>) => Promise<unknown>;
  create: (invoice: Invoice) => Promise<Invoice> | Invoice;
}
