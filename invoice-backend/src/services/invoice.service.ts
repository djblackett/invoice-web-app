import { Invoice, UserIdAndRole } from "../constants/types";
import {
  mapPartialInvoiceToInvoice,
  validateInvoiceData,
  validateInvoiceList,
} from "../utils/utils";
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
    @inject(TYPES.UserContext)
    private readonly userContext: UserIdAndRole,
  ) {}

  getInvoices = async (): Promise<Invoice[]> => {
    console.log(this.userContext);
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    const { role, id } = this.userContext;

    if (!id) {
      throw new ValidationException("Unauthorized");
    }

    if (role !== "ADMIN") {
      this.invoiceRepo.findByUserId(id);
    }
    try {
      const result = await this.invoiceRepo.findAll();
      console.log(result);
      // return result as Invoice[];
      return validateInvoiceList(result);
    } catch (e) {
      console.error(e);
      throw new InternalServerException("Internal server error");
    }
  };

  getInvoicesByUserId = async () => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }
    const { role, id } = this.userContext;

    if (!id) {
      throw new ValidationException("Unauthorized");
    }
    try {
      const result = await this.invoiceRepo.findByUserId(id);
      return validateInvoiceList(result);
    } catch (e) {
      console.error(e);
      throw new InternalServerException("Internal server error");
    }
  };

  getInvoiceById = async (invoiceId: string) => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }
    const { role, id } = this.userContext;

    if (!id || !role) {
      throw new ValidationException("Unauthorized");
    }

    if (role === "ADMIN") {
      try {
        const result = await this.invoiceRepo.findById(invoiceId);
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
    } else {
      try {
        const result = await this.invoiceRepo.findByUserIdAndInvoiceId(
          id,
          invoiceId,
        );
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
    }
  };

  addInvoice = async (invoice: Invoice) => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    try {
      const invoiceWithUserInfo = {
        ...invoice,
        createdById: this.userContext.id,
        createdBy: {
          id: this.userContext.id,
          name: this.userContext.name,
          username: this.userContext.username,
          role: this.userContext.role,
        },
      };

      const fullInvoice = mapPartialInvoiceToInvoice(invoiceWithUserInfo);
      const createdInvoice = await this.invoiceRepo.create(fullInvoice);
      const validatedData = validateInvoiceData(createdInvoice);

      console.log("invoiceWithUserInfo:", invoiceWithUserInfo);
      console.log("fullinvoice:", fullInvoice);
      console.log("createdInvoice:", createdInvoice);
      console.log("validatedData:", validatedData);

      return validatedData;
    } catch (e) {
      console.error(e);
      if (e instanceof ValidationException) {
        throw e;
      } else if (e instanceof NotFoundException) {
        throw e;
      } else {
        throw new InternalServerException("Internal server error");
      }
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
