import data from "../data/invoices";
import {Invoice} from "../types";
import {validateInvoiceData} from "../utils";
import {PrismaRepository} from "../repositories/prismaRepositoryImpl";
import {PrismaClient} from "@prisma/client";
import { inject, injectable } from "inversify";
import {InvoiceRepository} from "../repositories/InvoiceRepository";


// Convert this to a service that sits between graphQL and Prisma

const invoices: Invoice[] = data;

@injectable()
export class InvoiceService {

    constructor(@inject(InvoiceRepository) private readonly invoiceRepo: InvoiceRepository) {}

    // invoiceRepo = new PrismaRepository();

    getInvoices = async (): Promise<Invoice[]> => {return await this.invoiceRepo.findAll() as unknown as Invoice[];
    };

    getInvoiceById = (id: string) => {
      const invoice = invoices.find(invoice => invoice.id === id);
      return validateInvoiceData(invoice);
    };


    addInvoice = (invoice: Invoice) => {
      invoices.push(invoice);
    };

    updateInvoice = (id: string, invoiceUpdates: object) => {
      const oldInvoice = this.getInvoiceById(id);
      const newInvoiceUnvalidated = {...oldInvoice, ...invoiceUpdates};
      const validatedInvoice = validateInvoiceData(newInvoiceUnvalidated);
      const index = invoices.indexOf(oldInvoice);

      invoices.splice(index, 1, validatedInvoice);
      return validatedInvoice;
    };

    deleteInvoice = (id: string): boolean => {
        const invoice = invoices. find(item => item.id === id);
      if (invoice) {
        const index = invoices.indexOf(invoice);
        invoices.splice(index, 1);
        return true;
      }
    return false;
    };

}

// export default {
//   getInvoices,
//   getInvoiceById,
//   addInvoice,
//   updateInvoice,
//   deleteInvoice
// };
