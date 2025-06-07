import { Invoice, UserIdAndRole } from "../constants/types";
import PDFDocument from "pdfkit";
import {
  mapPartialInvoiceToInvoice,
  validateInvoiceData,
  validateInvoiceList,
} from "../utils/utils";
import { inject, injectable } from "inversify";
import { IInvoiceRepo } from "../repositories/InvoiceRepo";
import { RevisionService } from "./revision.service";
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
    @inject(TYPES.RevisionService)
    private readonly revisionService: RevisionService,
    @inject(TYPES.UserContext)
    private readonly userContext: UserIdAndRole | null,
  ) {}

  getInvoices = async (): Promise<Invoice[]> => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    const { role, id } = this.userContext;

    if (!id) {
      throw new ValidationException("Unauthorized");
    }

    if (role !== "ADMIN") {
      return validateInvoiceList(await this.invoiceRepo.findByUserId(id));
    }

    try {
      const result = await this.invoiceRepo.findAll();
      return validateInvoiceList(result);
    } catch (e) {
      console.error(e);
      throw new InternalServerException("Internal server error");
    }
  };

  getInvoiceById = async (
    invoiceId: string,
  ): Promise<Partial<Invoice> | null> => {
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
          console.error("role = ADMIN - Invoice not found");
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
          role,
          invoiceId,
        );
        if (!result) {
          console.error("role = USER - Invoice not found");
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
          username: this.userContext.username ?? "",
          role: this.userContext.role,
        },
      };

      const fullInvoice = mapPartialInvoiceToInvoice(invoiceWithUserInfo);
      const createdInvoice = await this.invoiceRepo.create(fullInvoice);
      const validatedData = validateInvoiceData(createdInvoice);

      // Create initial revision for the new invoice
      await this.revisionService.createRevision(
        validatedData.id,
        null,
        validatedData,
        'create',
        'Initial invoice creation'
      );

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

  updateInvoice = async (id: string, invoiceUpdates: Partial<Invoice>) => {
    const oldInvoice = await this.getInvoiceById(id);
    if (!oldInvoice) {
      throw new NotFoundException("Invoice not found");
    }

    try {
      const newInvoiceUnvalidated = { ...oldInvoice, ...invoiceUpdates };
      const validatedInvoice: Partial<Invoice> = validateInvoiceData(
        newInvoiceUnvalidated,
      );

      delete newInvoiceUnvalidated.createdBy;
      delete newInvoiceUnvalidated.createdById;
      
      // Create revision with proper diff tracking
      await this.revisionService.createRevision(
        id,
        oldInvoice,
        validatedInvoice,
        'update',
        'Invoice updated'
      );

      const result = await this.invoiceRepo.update(id, validatedInvoice);

      return result;
    } catch (e) {
      console.error(e);
      if (e instanceof ValidationException) {
        throw e;
      }
      throw new InternalServerException("Internal server error" + e);
    }
  };

  markAsPaid = async (id: string) => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }
    try {
      const oldInvoice = await this.getInvoiceById(id);
      if (!oldInvoice) {
        throw new NotFoundException("Invoice not found");
      }

      // Create revision before marking as paid
      const updatedInvoice = { ...oldInvoice, status: "paid" };
      await this.revisionService.createRevision(
        id,
        oldInvoice,
        updatedInvoice,
        'status_change',
        'Marked as paid'
      );

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

  deleteInvoice = async (invoiceId: string) => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    const { id, role } = this.userContext;
    const invoice = (await this.getInvoiceById(invoiceId)) as Invoice;
    if (invoice.createdById !== id || role !== "ADMIN") {
      throw new ValidationException("Unauthorized");
    }
    try {
      const result = await this.invoiceRepo.delete(invoiceId);
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
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    const { id, role } = this.userContext;

    if (!id || role !== "ADMIN") {
      throw new ValidationException("Unauthorized");
    }

    try {
      return await this.invoiceRepo.deleteAllInvoices();
    } catch (e) {
      console.error(e);
      throw new InternalServerException("Internal server error");
    }
  };

  deleteInvoicesByUserId = async () => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    const { id, role } = this.userContext;

    if (!id || role !== "ADMIN") {
      throw new ValidationException("Unauthorized");
    }

    try {
      return await this.invoiceRepo.deleteInvoicesByUserId(id);
    } catch (e) {
      console.error(e);
      throw new InternalServerException("Internal server error");
    }
  };

  generatePdf = async (invoiceId: string): Promise<string> => {
    const invoiceData = await this.getInvoiceById(invoiceId);
    if (!invoiceData) {
      throw new NotFoundException("Invoice not found");
    }

    // Since it's Partial, use optional chaining
    const invoice = invoiceData;

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => buffers.push(chunk));

    const pdfPromise = new Promise<string>((resolve) => {
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers).toString("base64");
        resolve(pdfData);
      });
    });

    // Generate PDF content
    doc.fontSize(20).text("Invoice", 50, 50);
    doc.fontSize(12).text(`Invoice ID: ${invoice.id ?? ''}`, 50, 80);
    doc.text(`Date: ${invoice.createdAt ?? ''}`, 50, 95);
    doc.text(`Payment Due: ${invoice.paymentDue ?? ''}`, 50, 110);

    doc.text("From:", 50, 140);
    doc.text(`${invoice.senderAddress?.street ?? ''}, ${invoice.senderAddress?.city ?? ''}`, 50, 155);
    doc.text(`${invoice.senderAddress?.postCode ?? ''}, ${invoice.senderAddress?.country ?? ''}`, 50, 170);

    doc.text("Bill To:", 300, 140);
    doc.text(`${invoice.clientName ?? ''}`, 300, 155);
    doc.text(`${invoice.clientAddress?.street ?? ''}, ${invoice.clientAddress?.city ?? ''}`, 300, 170);
    doc.text(`${invoice.clientAddress?.postCode ?? ''}, ${invoice.clientAddress?.country ?? ''}`, 300, 185);
    doc.text(`Email: ${invoice.clientEmail ?? ''}`, 300, 200);

    doc.text("Items:", 50, 230);
    let y = 245;
    (invoice.items ?? []).forEach((item) => {
      doc.text(`${item.quantity ?? 0} x ${item.name ?? ''} @ ${item.price ?? 0} = ${item.total ?? 0}`, 50, y);
      y += 15;
    });

    doc.text(`Total: ${invoice.total ?? 0}`, 50, y + 10);

    doc.end();

    return pdfPromise;
  };
}
