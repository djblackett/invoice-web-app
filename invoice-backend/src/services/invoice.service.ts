import { PrismaInvoiceRepository } from "../repositories/implementations/prismaInvoiceRepository";
import { Invoice } from "../constants/types";
import { validateInvoiceData, validateInvoiceList } from "../utils";
import { inject, injectable } from "inversify";

@injectable()
export class InvoiceService {
  constructor(@inject(PrismaInvoiceRepository) private readonly invoiceRepo: PrismaInvoiceRepository) {}

  getInvoices = async (): Promise<Invoice[]> => {
    const result = await this.invoiceRepo.findAll();
    console.log(result);
    return validateInvoiceList(result);
  };

  getInvoiceById = (id: string) => {
    return this.invoiceRepo.findById(id);
  };

  addInvoice = (invoice: Invoice) => {
    return this.invoiceRepo.create(invoice);
  };

  updateInvoice = async (id: string, invoiceUpdates: object): Promise<Invoice> => {
    const oldInvoice = await this.getInvoiceById(id);
    if (!oldInvoice) {
      throw new Error("Invoice not found");
    }
    const newInvoiceUnvalidated = { ...oldInvoice, ...invoiceUpdates };
    const validatedInvoice = validateInvoiceData(newInvoiceUnvalidated);
    return validateInvoiceData(this.invoiceRepo.editInvoice(id, validatedInvoice));
  };

  markAsPaid = (id: string) => {
    return validateInvoiceData(this.invoiceRepo.markAsPaid(id));
  };

  deleteInvoice = async (id: string) => {
    return validateInvoiceData(this.invoiceRepo.deleteInvoice(id));
  };

  getClientAddresses = async () => {
    return await this.invoiceRepo.findAllClientAddresses();
  };

  getSellerAddresses = async () => {
    return await this.invoiceRepo.findAllSenderAddresses();
  };


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapUserErrorToResponse(error: any) {
    switch (error.message) {
      case "ValidationError":
        return {
          status: 400,
          error: "ValidationError",
          data: undefined,
          success: false,
        };
      case "UserNotFound":
        return {
          status: 404,
          error: "UserNotFound",
          data: undefined,
          success: false,
        };
      case "UsernameAlreadyTaken":
        return {
          status: 409,
          error: "UsernameAlreadyTaken",
          data: undefined,
          success: false,
        };
      case "EmailAlreadyInUse":
        return {
          status: 409,
          error: "EmailAlreadyInUse",
          data: undefined,
          success: false,
        };
      default:
        return {
          status: 500,
          error: "ServerError",
          data: undefined,
          success: false,
        };
    }
  }
}
