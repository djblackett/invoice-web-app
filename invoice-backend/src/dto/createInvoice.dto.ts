import {
  ClientAddress,
  Invoice,
  InvoiceCreateArgs,
  Item,
  SenderAddress,
} from "../constants/types";

export class CreateInvoiceDto implements InvoiceCreateArgs {
  clientAddress: ClientAddress;
  clientEmail: string;
  clientName: string;
  createdAt: string;
  description: string;
  id: string;
  items: Item[];
  paymentDue: string;
  paymentTerms: number;
  senderAddress: SenderAddress;
  status: string;
  total: number;

  constructor(invoice: Invoice) {
    this.clientAddress = invoice.clientAddress;
    this.clientEmail = invoice.clientEmail;
    this.clientName = invoice.clientName;
    this.createdAt = invoice.createdAt;
    this.description = invoice.description;
    this.id = invoice.id;
    this.items = invoice.items;
    this.paymentDue = invoice.paymentDue;
    this.paymentTerms = invoice.paymentTerms;
    this.senderAddress = invoice.senderAddress;
    this.status = invoice.status;
    this.total = invoice.total;
    // Initialize any additional DTO-specific fields here
  }

  // Additional DTO-specific fields or validation logic can be added here
}
