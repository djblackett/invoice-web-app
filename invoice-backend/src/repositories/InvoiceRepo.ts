import { Invoice } from "../constants/types";

export interface IInvoiceRepo {
  findAll: () => Promise<Partial<Invoice>[]> | Partial<Invoice>[];
  findById: (id: string) => Promise<Invoice> | Invoice;
  deleteInvoice: (id: string) => Promise<any>;
  markAsPaid: (id: string) => void;
  editInvoice: (id: string, invoiceUpdates: Partial<Invoice>) => Promise<Invoice> | Invoice;
  create: (invoice: Invoice) => Promise<Invoice> | Invoice;
}
