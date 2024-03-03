import data from "../data/invoices";
import {InvoiceRepository} from "../repositories/InvoiceRepository";
import {Invoice} from "../constants/types";
import {validateInvoiceData} from "../utils";
import { inject, injectable } from "inversify";
import TYPES from "../constants/identifiers";


console.log("Identifiers:", TYPES);
const invoices: Invoice[] = data;

@injectable()
export class InvoiceService {
     // invoiceRepo: InvoiceRepository;
     constructor(@inject(InvoiceRepository) private readonly invoiceRepo: InvoiceRepository
     ) {
        // this.invoiceRepo = invoiceRepo;
        //  console.log("In constructor:", TYPES)
    }



    getInvoices = async (): Promise<Invoice[] | null> => {
         // @ts-ignore
        return await this.invoiceRepo.findAll();
    };

    getInvoiceById = (id: string) => {
      const invoice = invoices.find(invoice => invoice.id === id);
      return validateInvoiceData(invoice);
    };


    addInvoice = (invoice: Invoice) => {
      // invoices.push(invoice);
      const result = this.invoiceRepo.create(invoice);
      return result;
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
