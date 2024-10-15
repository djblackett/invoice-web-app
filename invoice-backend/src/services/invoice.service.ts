import { Invoice } from "../constants/types";
import { validateInvoiceData, validateInvoiceList } from "../utils";
import { inject, injectable } from "inversify";
import { IInvoiceRepo } from "../repositories/InvoiceRepo";
import TYPES from "../constants/identifiers";
import {
  InternalServerException,
  NotFoundException,
  ValidationException,
} from "../config/exception.config";

@injectable()
export class InvoiceService {
  constructor(
    @inject(TYPES.IInvoiceRepo)
    private readonly invoiceRepo: IInvoiceRepo,
  ) {}

  getInvoices = async (): Promise<Invoice[]> => {
    try {
      const result = await this.invoiceRepo.findAll();
      return validateInvoiceList(result);
    } catch (e) {
      console.error(e);
      throw new InternalServerException("Internal server error");
    }
  };

  getInvoiceById = async (id: string) => {
    try {
      const result = await this.invoiceRepo.findById(id);
      if (!result) {
        throw new NotFoundException("Invoice not found");
      }
      return result;
    } catch (e) {
      console.error(e);
      if (e instanceof ValidationException) {
        throw e;
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerException("Internal server error");
    }
  };

  addInvoice = async (invoice: Invoice) => {
    try {
      return validateInvoiceData(await this.invoiceRepo.create(invoice));
    } catch (e) {
      console.error(e);
      if (e instanceof ValidationException) {
        throw e;
      }
      throw new InternalServerException("Internal server error");
    }
  };

  updateInvoice = async (id: string, invoiceUpdates: object) => {
    const oldInvoice = await this.getInvoiceById(id);
    if (!oldInvoice) {
      throw new NotFoundException("Invoice not found");
    }

    try {
      const newInvoiceUnvalidated = { ...oldInvoice, ...invoiceUpdates };
      const validatedInvoice = validateInvoiceData(newInvoiceUnvalidated);

      const result = await this.invoiceRepo.update(id, validatedInvoice);

      return validateInvoiceData(result);
    } catch (e) {
      console.error(e);
      if (e instanceof ValidationException) {
        throw e;
      }
      throw new InternalServerException("Internal server error");
    }
  };

  markAsPaid = async (id: string) => {
    try {
      const result = await this.invoiceRepo.markAsPaid(id);
      return validateInvoiceData(result);
    } catch (e) {
      console.error(e);
      if (e instanceof ValidationException) {
        throw e;
      }
      throw new InternalServerException("Internal server error");
    }
  };

  deleteInvoice = async (id: string) => {
    try {
      const result = await this.invoiceRepo.delete(id);
      if (!result) {
        throw new NotFoundException("Invoice not found");
      }
      return result;
    } catch (e) {
      console.error(e);
      throw new InternalServerException("Internal server error");
    }
  };

  deleteAllInvoices = async () => {
    try {
      return await this.invoiceRepo.deleteAllInvoices();
    } catch (e) {
      console.error(e);
      throw new InternalServerException("Internal server error");
    }
  };
}
