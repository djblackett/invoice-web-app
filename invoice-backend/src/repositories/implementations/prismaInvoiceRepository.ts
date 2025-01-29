import { Prisma } from "@prisma/client";
import { inject, injectable } from "inversify";
import { Invoice } from "../../constants/types";
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
        },
      });

      return result;
    } catch (e) {
      console.error(e);
      return prismaErrorHandler(e);
    }
  }

  async findByUserIdAndInvoiceId(userId: string, invoiceId: string) {
    try {
      const result = await this.prisma.invoice.findUniqueOrThrow({
        where: {
          id: invoiceId,
          createdBy: {
            id: userId,
          },
        },
        include: {
          items: true,
          clientAddress: true,
          senderAddress: true,
        },
      });

      return result;
    } catch (e: any) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
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
            ...invoiceUpdates,
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
          },
        });

        return inputUpdateResult;
      });

      return updatedInvoice;
    } catch (e) {
      console.error(e);
      return prismaErrorHandler(e);
    }
  }

  // async create(
  //   invoice: Invoice | Partial<Invoice>,
  //   createdBy: string,
  // ): Promise<unknown> {
  //   try {
  //     const result = await this.prisma.invoice.create({
  //       data: {
  //         createdById: createdById,
  //         clientEmail: invoice.clientEmail || "",
  //         clientName: invoice.clientName || "",
  //         createdAt:
  //           invoice?.createdAt || Temporal.Now.plainDateISO().toLocaleString(),
  //         description: invoice?.description || "",
  //         id: invoice.id,
  //         paymentDue:
  //           invoice?.paymentDue ||
  //           Temporal.Now.plainDateISO().add({ days: 1 }).toLocaleString(),
  //         paymentTerms: invoice.paymentTerms || 14,
  //         status: invoice.status || "",
  //         total: new Decimal(Number(invoice.total)),
  //         clientAddress: {
  //           create: {
  //             city: invoice?.clientAddress?.city || "",
  //             country: invoice?.clientAddress?.country || "",
  //             postCode: invoice?.clientAddress?.postCode || "",
  //             street: invoice?.clientAddress?.street || "",
  //           },
  //         },
  //         senderAddress: {
  //           create: {
  //             city: invoice?.senderAddress?.city || "",
  //             country: invoice?.senderAddress?.country || "",
  //             postCode: invoice?.senderAddress?.postCode || "",
  //             street: invoice?.senderAddress?.street || "",
  //           },
  //         },
  //         items: {
  //           create:
  //             (invoice.items &&
  //               invoice?.items?.map((item) => ({
  //                 name: item.name || "",
  //                 price: Number(item.price) || 0,
  //                 quantity: Number(item.quantity) || 0,
  //                 total: Number(item.total) || 0,
  //                 id: item.id || undefined,
  //               }))) ||
  //             [],
  //         },
  //       },

  //       include: {
  //         clientAddress: true,
  //         senderAddress: true,
  //         items: true,
  //         createdBy: true,
  //       },
  //     });

  //     return result;
  //   } catch (e: any) {
  //     if (
  //       e instanceof Prisma.PrismaClientKnownRequestError &&
  //       e.code === "P2002"
  //     ) {
  //       throw new Error("Unique constraint failed on the fields: (`id`)");
  //     } else {
  //       throw new Error(`Failed to create invoice: ${e.message}`);
  //     }
  //   }
  // }

  async create(
    invoice: Partial<Invoice>,
    createdById: string,
  ): Promise<Invoice> {
    try {
      console.log("Creating invoice for user ID:", createdById);

      // Verify that the user exists
      const user = await this.prisma.user.findUnique({
        where: { id: createdById },
      });
      if (!user) {
        throw new ValidationException("User does not exist");
      }

      const clientAddress = await this.prisma.clientAddress.create({
        data: {
          city: invoice?.clientAddress?.city || "",
          country: invoice?.clientAddress?.country || "",
          postCode: invoice?.clientAddress?.postCode || "",
          street: invoice?.clientAddress?.street || "",
        },
      });

      const senderAddress = await this.prisma.senderAddress.create({
        data: {
          city: invoice?.senderAddress?.city || "",
          country: invoice?.senderAddress?.country || "",
          postCode: invoice?.senderAddress?.postCode || "",
          street: invoice?.senderAddress?.street || "",
        },
      });

      const result = await this.prisma.invoice.create({
        data: {
          createdById: createdById,
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
          clientAddressId: clientAddress.id,
          senderAddressId: senderAddress.id,
        },
        include: {
          items: true,
          clientAddress: true,
          senderAddress: true,
          createdBy: true,
        },
      });

      console.log("Invoice created:", result);
      return validateInvoiceData(result);
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw new InternalServerException("Failed to create invoice");
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
