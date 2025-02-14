import { Prisma, Role } from "@prisma/client";
import { inject, injectable } from "inversify";
import { Invoice, InvoiceWithCreatedBy } from "../../constants/types";
import { DatabaseConnection } from "../../database/prisma.database.connection";
import { IInvoiceRepo } from "../InvoiceRepo";
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
  ValidationException,
} from "../../config/exception.config";
import { validateInvoiceData } from "@/utils/utils";

@injectable()
export class PrismaInvoiceRepository implements IInvoiceRepo {
  protected prisma;

  constructor(
    @inject(DatabaseConnection)
    private readonly databaseConnection: DatabaseConnection,
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
    } catch (e: any) {
      throw new Error(`Database error: ${e.message}`);
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
    } catch (e: any) {
      throw new Error(`Database error: ${e.message}`);
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

      if (!result) {
        throw new NotFoundException("Invoice not found");
      }

      return result;
    } catch (e) {
      console.error(e);
      throw prismaErrorHandler(e);
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
    } catch (e: any) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        console.error("Catch block - Invoice not found");
        throw new NotFoundException("Invoice not found");
      } else {
        throw new InternalServerException(`Database error: ${e.message}`);
      }
    }
  }

  async markAsPaid(id: string) {
    try {
      return await this.prisma.invoice.update({
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
    } catch (e) {
      console.error(e);
      return prismaErrorHandler(e);
    }
  }

  async update(id: string, invoiceUpdates: Partial<Invoice>) {
    try {
      const updatedInvoice = await this.prisma.$transaction(async (prisma) => {
        if (invoiceUpdates.items && invoiceUpdates?.items?.length >= 1) {
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
                skipDuplicates: true,
              },
            },
          } as Prisma.InvoiceUpdateInput,
          include: {
            items: true,
            clientAddress: true,
            senderAddress: true,
            // createdBy: true,
          },
        });

        return inputUpdateResult;
      });

      return updatedInvoice;
    } catch (e) {
      console.error(e);
      throw prismaErrorHandler(e);
    }
  }

  async create(invoice: InvoiceWithCreatedBy): Promise<unknown> {
    try {
      // console.log("Creating invoice for user ID:", invoice.createdById);

      // Verify that the user exists

      try {
        const user = await this.prisma.user.findUnique({
          where: { id: invoice.createdById },
        });
        if (!user) {
          throw new ValidationException("User does not exist");
        }
      } catch (error) {
        console.error("Error finding user:", error);
        throw error;
      }

      const result = await this.prisma.invoice.create({
        data: {
          createdBy: {
            connect: { id: invoice.createdById },
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
            create:
              invoice.items?.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
              })) || [],
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
      const createdInvoice = {
        ...result,
        total: Number(result.total),
      };

      // console.log("Invoice created:", createdInvoice);
      return createdInvoice;
    } catch (error) {
      console.error("Error creating invoice:", error);
      // throw new InternalServerException("Failed to create invoice");
      return prismaErrorHandler(error);
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
    } catch (e: any) {
      throw new Error(`Database error: ${e.message}`);
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
    } catch (e: any) {
      throw new Error(`Database error: ${e.message}`);
    }
  }
}

export const prismaErrorHandler = (e: any): never => {
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
    throw new InternalServerException(`Database error: ${e.message}`);
  }
};
