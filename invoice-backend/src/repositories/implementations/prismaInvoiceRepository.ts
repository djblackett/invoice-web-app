import { Prisma } from "@prisma/client";
import { inject, injectable } from "inversify";
import { ClientAddress, Invoice, Item } from "../../constants/types";
import { DatabaseConnection } from "../../database/prisma.database.connection";
import { Temporal } from "temporal-polyfill";
import { IInvoiceRepo } from "../InvoiceRepo";
import { Decimal } from "@prisma/client/runtime/library";

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
        },
      });
      return result;
    } catch (e) {
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

  async findAllClientAddresses(): Promise<ClientAddress[] | null> {
    try {
      return await this.prisma.clientAddress.findMany();
    } catch (error) {
      console.error(error);
      throw new Error("ServerError");
    }
  }

  async findAllSenderAddresses(): Promise<ClientAddress[] | null> {
    try {
      return await this.prisma.senderAddress.findMany();
    } catch (error) {
      console.error(error);
      throw new Error("ServerError");
    }
  }

  async markAsPaid(id: string) {
    try {
      return this.prisma.invoice.update({
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
                data: (invoiceUpdates.items as Item[]).map((item) => ({
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  total: item.total,
                })) as Prisma.ItemCreateManyInput[],
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

  async create(invoice: Invoice | Partial<Invoice>): Promise<unknown> {
    try {
      const result = await this.prisma.invoice.create({
        data: {
          clientEmail: invoice.clientEmail || "",
          clientName: invoice.clientName || "",
          createdAt:
            invoice?.createdAt || Temporal.Now.plainDateISO().toLocaleString(),
          description: invoice?.description || "",
          id: invoice.id,
          paymentDue:
            invoice?.paymentDue ||
            Temporal.Now.plainDateISO().add({ days: 1 }).toLocaleString(),
          paymentTerms: invoice.paymentTerms || 14,
          status: invoice.status || "",
          total: new Decimal(Number(invoice.total)) || 0,
          clientAddress: {
            create: {
              city: invoice?.clientAddress?.city || "",
              country: invoice?.clientAddress?.country || "",
              postCode: invoice?.clientAddress?.postCode || "",
              street: invoice?.clientAddress?.street || "",
            },
          },
          senderAddress: {
            create: {
              city: invoice?.senderAddress?.city || "",
              country: invoice?.senderAddress?.country || "",
              postCode: invoice?.senderAddress?.postCode || "",
              street: invoice?.senderAddress?.street || "",
            },
          },
          items: {
            create:
              invoice?.items?.map((item) => ({
                name: item.name || "",
                price: Number(item.price) || 0,
                quantity: Number(item.quantity) || 0,
                total: Number(item.total) || 0,
                id: item.id || undefined,
              })) || [],
          },
        },
        include: {
          clientAddress: true,
          senderAddress: true,
          items: true,
        },
      });

      return result;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new Error("Unique constraint failed on the fields: (`id`)");
      } else {
        throw new Error(`Failed to create invoice: ${e.message}`);
      }
    }
  }

  async delete(id: string) {
    try {
      const result = await this.prisma.invoice.delete({
        where: {
          id,
        },
      });
      console.log("delete invoice result:", result);
      return result;
    } catch (e) {
      console.error(e);
      return prismaErrorHandler(e);
    }
  }
}

const prismaErrorHandler = (e: any): never => {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    throw new Error("Unique constraint failed on the fields: (`id`)");
  } else if (
    e instanceof Prisma.PrismaClientKnownRequestError &&
    e.code === "P2025"
  ) {
    throw new Error("Invoice not found");
  } else {
    throw new Error(`Database error: ${e.message}`);
  }
};
