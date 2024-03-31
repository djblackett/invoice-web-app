import { PrismaInvoiceRepository } from "../repositories/implementations/prismaInvoiceRepository";
import { CreateUserArgs, Invoice } from "../constants/types";
import { validateInvoiceData } from "../utils";
import { inject, injectable } from "inversify";
import bcrypt from "bcrypt";

@injectable()
export class InvoiceService {
  constructor(@inject(PrismaInvoiceRepository) private readonly invoiceRepo: PrismaInvoiceRepository) {}

  getInvoices = async (): Promise<Invoice[] | null> => {
    // @ts-ignore
    return await this.invoiceRepo.findAll();
  };

  getInvoiceById = (id: string) => {
    return this.invoiceRepo.findById(id);
  };

  addInvoice = (invoice: Invoice) => {
    return this.invoiceRepo.create(invoice);
  };

  updateInvoice = (id: string, invoiceUpdates: object) => {
    const oldInvoice = this.getInvoiceById(id);
    const newInvoiceUnvalidated = { ...oldInvoice, ...invoiceUpdates };
    const validatedInvoice = validateInvoiceData(newInvoiceUnvalidated);
    return this.invoiceRepo.editInvoice(id, validatedInvoice);
  };

  markAsPaid = (id: string) => {
    return this.invoiceRepo.markAsPaid(id);
  };

  deleteInvoice = async (id: string) => {
    return this.invoiceRepo.deleteInvoice(id);
  };

  getClientAddresses = async () => {
    return await this.invoiceRepo.findAllClientAddresses();
  };

  getSellerAddresses = async () => {
    return await this.invoiceRepo.findAllSenderAddresses();
  };


}
