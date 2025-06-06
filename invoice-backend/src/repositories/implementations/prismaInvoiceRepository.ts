import { Prisma, Role } from "@prisma/client";
import * as jsondiffpatch from "jsondiffpatch";
import { inject, injectable } from "inversify";
import { Invoice, InvoiceWithCreatedBy } from "@/constants/types";
import { IDatabaseConnection } from "@/database/database.connection";
import TYPES from "@/constants/identifiers";
import { IInvoiceRepo } from "../InvoiceRepo";
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
  ValidationException,
} from "@/config/exception.config";

const jdp = jsondiffpatch.create({
  objectHash: (obj: any) => obj.id ?? JSON.stringify(obj),
});

@injectable()
export class PrismaInvoiceRepository implements IInvoiceRepo {
  protected prisma;

  constructor(
    @inject(TYPES.DatabaseConnection)
    databaseConnection: IDatabaseConnection,
  ) {
    this.prisma = databaseConnection.getDatabase();
  }

  async findAll(): Promise<unknown> {
    try {
      const result = await this.prisma.invoice.findMany({
        include: {
          items: true,
          clientAddress: true,
          senderAddress: true,
          createdBy: true,
        },
      });
      return result;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      throw new Error(`Database error: ${errorMessage}`);
    }
  }

  async findByUserId(userId: string): Promise<unknown> {
    try {
      const result = await this.prisma.invoice.findMany({
        where: {
          createdBy: {
            id: userId,
          },
        },
        include: {
          items: true,
          clientAddress: true,
          senderAddress: true,
          createdBy: true,
        },
      });
      return result;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      throw new Error(`Database error: ${errorMessage}`);
    }
  }

  async findById(id: string): Promise<unknown> {
    try {
      const result = await this.prisma.invoice.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          items: true,
          clientAddress: true,
          senderAddress: true,
          createdBy: true,
        },
      });

      return result;
    } catch (e: unknown) {
      console.error(e);
      prismaErrorHandler(e);
      throw new Error("Unhandled error in findById"); // This line is unreachable but ensures all code paths return
    }
  }

  async findByUserIdAndInvoiceId(
    userId: string,
    role: Role,
    invoiceId: string,
  ) {
    try {
      const result = await this.prisma.invoice.findUniqueOrThrow({
        where: {
          id: invoiceId,
        },
        include: {
          items: true,
          clientAddress: true,
          senderAddress: true,
          createdBy: true,
        },
      });

      if (result.createdById === userId || role !== "ADMIN") {
        return result;
      }
      throw new NotFoundException("Don't have necessary permissions");
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        console.error("Catch block - Invoice not found");
        throw new NotFoundException("Invoice not found");
      } else {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        throw new InternalServerException(`Database error: ${errorMessage}`);
      }
    }
  }

  async markAsPaid(id: string, updatedById: string) {
    try {
      const currentInvoice = await this.prisma.invoice.findUnique({
        where: { id },
        include: {
          items: true,
          clientAddress: true,
          senderAddress: true,
          createdBy: true,
        },
      });
      if (!currentInvoice) {
        throw new NotFoundException("Invoice not found");
      }
      const firstRevision = await this.prisma.invoiceRevision.findFirst({
        where: { invoiceId: id },
        orderBy: { createdAt: "asc" },
      });
      let revisionDataObj;
      if (!firstRevision) {
        revisionDataObj = currentInvoice;
      } else {
        const initialState = JSON.parse(firstRevision.data);
        revisionDataObj = jdp.diff(initialState, currentInvoice) || {};
      }
      const revisionData = JSON.stringify(revisionDataObj);
      return await this.prisma.$transaction(async (prisma) => {
        await prisma.invoiceRevision.create({
          data: {
            invoiceId: id,
            data: revisionData,
            createdById: updatedById,
          },
        });
        return prisma.invoice.update({
          where: {
            id,
          },
          data: {
            status: "paid",
          },
          include: {
            items: true,
            clientAddress: true,
            senderAddress: true,
            createdBy: true,
          },
        });
      });
    } catch (e) {
      console.error(e);
      return prismaErrorHandler(e);
    }
  }

  async update(
    id: string,
    invoiceUpdates: Partial<Invoice>,
    updatedById: string,
  ) {
    try {
      const currentInvoice = await this.prisma.invoice.findUnique({
        where: { id },
        include: {
          items: true,
          clientAddress: true,
          senderAddress: true,
          createdBy: true,
        },
      });
      if (!currentInvoice) {
        throw new NotFoundException("Invoice not found");
      }
      const firstRevision = await this.prisma.invoiceRevision.findFirst({
        where: { invoiceId: id },
        orderBy: { createdAt: "asc" },
      });
      let revisionDataObj;
      if (!firstRevision) {
        revisionDataObj = currentInvoice;
      } else {
        const initialState = JSON.parse(firstRevision.data);
        revisionDataObj = jdp.diff(initialState, currentInvoice) || {};
      }
      const revisionData = JSON.stringify(revisionDataObj);
      const updatedInvoice = await this.prisma.$transaction(async (prisma) => {
        await prisma.invoiceRevision.create({
          data: {
            invoiceId: id,
            data: revisionData,
            createdById: updatedById,
          },
        });
        if (invoiceUpdates.items && invoiceUpdates.items.length >= 1) {
          await prisma.item.deleteMany({
            where: { invoiceId: id },
          });
        }

        const inputUpdateResult = await prisma.invoice.update({
          where: {
            id: id,
          },
          data: {
            description: invoiceUpdates.description,
            clientEmail: invoiceUpdates.clientEmail,
            clientName: invoiceUpdates.clientName,
            paymentDue: invoiceUpdates.paymentDue,
            paymentTerms: invoiceUpdates.paymentTerms,
            status: invoiceUpdates.status,
            total: invoiceUpdates.total,
            clientAddress: invoiceUpdates.clientAddress
              ? {
                  update: {
                    street: invoiceUpdates.clientAddress.street,
                    city: invoiceUpdates.clientAddress.city,
                    postCode: invoiceUpdates.clientAddress.postCode,
                    country: invoiceUpdates.clientAddress.country,
                  },
                }
              : undefined,
            senderAddress: invoiceUpdates.senderAddress
              ? {
                  update: {
                    street: invoiceUpdates.senderAddress.street,
                    city: invoiceUpdates.senderAddress.city,
                    postCode: invoiceUpdates.senderAddress.postCode,
                    country: invoiceUpdates.senderAddress.country,
                  },
                }
              : undefined,
            items: {
              createMany: {
                data:
                  invoiceUpdates.items &&
                  (invoiceUpdates.items.map((item) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.total,
                  })) as Prisma.ItemCreateManyInput[]),
              },
            },
          } as Prisma.InvoiceUpdateInput,
          include: {
            items: true,
            clientAddress: true,
            senderAddress: true,
          },
        });

        return inputUpdateResult;
      });

      return updatedInvoice;
    } catch (e) {
      console.error("Update invoice error:", e);
      return prismaErrorHandler(e);
    }
  }

  async create(invoice: InvoiceWithCreatedBy): Promise<unknown> {
    try {
      try {
        const user = await this.prisma.user.findUnique({
          where: { id: invoice.createdById ?? "" },
        });
        if (!user) {
          throw new ValidationException("User does not exist");
        }
      } catch (error) {
        console.error("Error finding user:", error);
        throw error;
      }

      const createdInvoice = await this.prisma.$transaction(async (prisma) => {
        const result = await prisma.invoice.create({
          data: {
            createdBy: {
              connect: { id: invoice.createdById ?? "" },
            },
            id: invoice.id || "",
            clientEmail: invoice.clientEmail || "",
            clientName: invoice.clientName || "",
            createdAt: invoice.createdAt || new Date().toISOString(),
            description: invoice.description || "",
            paymentDue:
              invoice.paymentDue ||
              new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            paymentTerms: invoice.paymentTerms || 14,
            status: invoice.status || "pending",
            total: invoice.total || new Prisma.Decimal(0),
            items: {
              create: (invoice.items ?? []).map((item) => ({
                name: item.name ?? "",
                quantity: item.quantity ?? 0,
                price: item.price ?? 0,
                total: item.total ?? 0,
              })),
            },
            ...(invoice.clientAddress && {
              clientAddress: {
                create: {
                  city: invoice.clientAddress.city,
                  country: invoice.clientAddress.country,
                  postCode: invoice.clientAddress.postCode,
                  street: invoice.clientAddress.street,
                },
              },
            }),
            ...(invoice.senderAddress && {
              senderAddress: {
                create: {
                  city: invoice.senderAddress.city,
                  country: invoice.senderAddress.country,
                  postCode: invoice.senderAddress.postCode,
                  street: invoice.senderAddress.street,
                },
              },
            }),
          },
          include: {
            items: true,
            clientAddress: true,
            senderAddress: true,
            createdBy: true,
          },
        });

        // Convert total from Decimal to number
        const tempCreatedInvoice = {
          ...result,
          total: Number(result.total),
        };

        const revisionData = JSON.stringify(tempCreatedInvoice);

        await prisma.invoiceRevision.create({
          data: {
            invoiceId: result.id,
            data: revisionData,
            createdById: invoice.createdById ?? "",
          },
        });

        return tempCreatedInvoice;
      });

      return createdInvoice;
    } catch (error) {
      console.error("Error creating invoice:", error);
      return prismaErrorHandler(error);
    }
  }

  async getRevisionsForInvoice(
    invoiceId: string,
    startDate?: string,
    endDate?: string,
    userId?: string,
  ): Promise<unknown> {
    const where: any = { invoiceId };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }
    if (userId) where.createdById = userId;

    try {
      const result = await this.prisma.invoiceRevision.findMany({
        where,
        include: {
          createdBy: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return result;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      throw new Error(`Database error: ${errorMessage}`);
    }
  }

  async getRestoredInvoiceFromRevision(revisionId: string): Promise<unknown> {
    try {
      const revision = await this.prisma.invoiceRevision.findUnique({
        where: { id: revisionId },
      });
      if (!revision) {
        throw new NotFoundException("Revision not found");
      }
      const firstRevision = await this.prisma.invoiceRevision.findFirst({
        where: { invoiceId: revision.invoiceId },
        orderBy: { createdAt: "asc" },
      });
      if (!firstRevision) {
        throw new NotFoundException("First revision not found");
      }
      const initialState = JSON.parse(firstRevision.data);
      if (firstRevision.id === revision.id) {
        return initialState;
      } else {
        const diff = JSON.parse(revision.data);
        const restored = jdp.patch(initialState, diff);
        return restored;
      }
    } catch (e) {
      console.error(e);
      return prismaErrorHandler(e);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.invoice.delete({
        where: { id },
      });
      return true;
    } catch (e) {
      console.error(e);
      prismaErrorHandler(e);
      return false;
    }
  }

  async deleteAllInvoices() {
    try {
      return await this.prisma.invoice.deleteMany({});
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      throw new Error(`Database error: ${errorMessage}`);
    }
  }

  async deleteInvoicesByUserId(userId: string) {
    try {
      return await this.prisma.invoice.deleteMany({
        where: {
          createdBy: {
            id: userId,
          },
        },
      });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      throw new Error(`Database error: ${errorMessage}`);
    }
  }
}

export const prismaErrorHandler = (e: unknown): never => {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    throw new BadRequestException(
      "Unique constraint failed on the fields: (`id`)",
    );
  } else if (
    e instanceof Prisma.PrismaClientKnownRequestError &&
    e.code === "P2025"
  ) {
    throw new NotFoundException("Invoice not found");
  } else {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    throw new Error(`Database error: ${errorMessage}`);
  }
};
