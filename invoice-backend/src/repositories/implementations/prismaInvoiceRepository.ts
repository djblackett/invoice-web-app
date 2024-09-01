import { Prisma,  } from "@prisma/client";
import { inject, injectable } from "inversify";
import { ClientAddress, Invoice, Item } from "../../constants/types";
import { DatabaseConnection } from "../../database/prisma.database.connection";
import { Temporal } from "temporal-polyfill";
import { IInvoiceRepo } from "../InvoiceRepo";
import { validateInvoiceData } from "../../utils";

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
      // return validateInvoiceList(result);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("ServerError");
    }
  }

  async findById(id: string): Promise<Invoice> {
    try {
      const result = await this.prisma.invoice.findUnique({
        where: {
          id,
        },
        include: {
          items: true,
          clientAddress: true,
          senderAddress: true,
        },
      });

      return validateInvoiceData(result);

    } catch (error) {
      console.error(error);
      throw new Error("ServerError");
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
    } catch (error) {
      console.error(error);
      throw new Error("ServerError");
    }
  }

  async editInvoice(id: string, invoiceUpdates: Partial<Invoice>) {
    try {
      // Deleting the items before updating to ensure that new copies are made. Prisma makes updating items and
      // adding new ones at the same time really difficult.
      if (invoiceUpdates.items && invoiceUpdates?.items?.length >= 1) {
        await this.prisma.invoice.update({
          where: {
            id: id,
          },
          data: {
            items: {
              deleteMany: {},
            },
          },
        });
        console.log("Original items deleted");
      }

      const updatedInvoice = await this.prisma.invoice.update({
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
              data: (invoiceUpdates.items as Item[]).map(item => ({
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
      console.log(updatedInvoice);
      return updatedInvoice;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async create(invoice: Invoice): Promise<unknown>
    {
    try {
      const result =  await this.prisma.invoice.create({
        data: {
          clientEmail: invoice.clientEmail || "",
          clientName: invoice.clientName || "",
          createdAt: invoice?.createdAt || Temporal.Now.plainDateISO().toLocaleString(),
          description: invoice?.description || "",
          id: invoice.id,
          paymentDue: invoice?.paymentDue || Temporal.Now.plainDateISO().add({ days: 1 }).toLocaleString(),
          paymentTerms: invoice.paymentTerms || 14,
          status: invoice.status || "",
          total: invoice.total || 0,
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
            //ts-ignore
            create: invoice?.items?.map((item) => ({
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

      console.log("Result:", result);
      return validateInvoiceData(result);
      //  return result;
    } catch (error) {
      console.error(error);
      return error;
      // throw new GraphQLError(
      //   "Creating the invoice failed. Make sure the id is unique",
      //   {
      //     extensions: {
      //       code: "BAD_INVOICE_INPUT",
      //       invalidinvoice: invoice.id,
      //       error,
      //     },
      //   },
      // );
    }
  }

  async deleteInvoice(id: string) {
    try {
      const result = await this.prisma.invoice.delete({
        where: {
          id,
        },
      });
      console.log("delete invoice result:", result);
      return "Invoice deleted successfully";
    } catch (error) {
      console.error(error);
      return error;
    }
  }

}
