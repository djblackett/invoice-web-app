import { PrismaInvoiceRepository } from "../repositories/implementations/prismaInvoiceRepository";
import { Invoice } from "../constants/types";
import { validateInvoiceData, validateInvoiceList } from "../utils";
import { inject, injectable } from "inversify";
import { IInvoiceRepo } from "../repositories/InvoiceRepo";

@injectable()
export class InvoiceService {
  constructor(
    @inject(PrismaInvoiceRepository)
    private readonly invoiceRepo: IInvoiceRepo,
  ) {}

  getInvoices = async (): Promise<Invoice[]> => {
    try {
      const result = await this.invoiceRepo.findAll();
      console.log(result);
      return validateInvoiceList(result);
    } catch (e) {
      console.error(e);
      throw new Error("Validation failed: " + e.message);
    }
  };

  getInvoiceById = async (id: string) => {
    try {
      return validateInvoiceData(await this.invoiceRepo.findById(id));
    } catch (e) {
      console.error(e);
      throw new Error("Validation failed: " + e.message);
    }
  };

  addInvoice = async (invoice: Invoice) => {
    console.log("Inside service:", invoice);
    // return validateInvoiceData(invoice);
    return validateInvoiceData(await this.invoiceRepo.create(invoice));
  };

  updateInvoice = async (id: string, invoiceUpdates: object) => {
    const oldInvoice = await this.getInvoiceById(id);
    if (!oldInvoice) {
      throw new Error("Invoice not found");
    }
    const newInvoiceUnvalidated = { ...oldInvoice, ...invoiceUpdates };
    const validatedInvoice = validateInvoiceData(newInvoiceUnvalidated);

    const result = await this.invoiceRepo.update(id, validatedInvoice);
    console.log("Validated invoice after update:", result);

    return validateInvoiceData(result);
  };

  markAsPaid = async (id: string) => {
    const result = await this.invoiceRepo.markAsPaid(id);
    return validateInvoiceData(result);
  };

  deleteInvoice = async (id: string) => {
    return validateInvoiceData(await this.invoiceRepo.delete(id));
  };
}
