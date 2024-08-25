import { DefaultArgs, GetFindResult} from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";
import { inject, injectable } from "inversify";
import { ClientAddress, Invoice } from "../../constants/types";
import { DatabaseConnection } from "../../database/prisma.database.connection";
import { GraphQLError } from "graphql/error";
import { Temporal } from "temporal-polyfill";
import { IInvoiceRepo } from "../InvoiceRepo";
import { validateInvoiceData, validateInvoiceList } from "../../utils";

@injectable()
export class PrismaInvoiceRepository implements IInvoiceRepo {
  protected prisma;

  constructor(
    @inject(DatabaseConnection)
    private readonly databaseConnection: DatabaseConnection,
  ) {
    this.prisma = databaseConnection.getDatabase();
  }

  async findAll(): Promise<Partial<Invoice>[]>
  {
    try {
      const result: GetFindResult<Prisma.$InvoicePayload<DefaultArgs>, {
        include: { senderAddress: boolean; items: boolean; clientAddress: boolean }
      }>[] = await this.prisma.invoice.findMany({
        include: {
          items: true,
          clientAddress: true,
          senderAddress: true,
        },
      });
      // return validateInvoiceList(result);
      return result as unknown as Partial<Invoice>[];
    } catch (error: any) {
      console.error(error);
      return error;
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

    } catch (error: any) {
      console.error(error);
      return error;
    }
  }

  async findAllClientAddresses(): Promise<ClientAddress[] | null> {
    try {
      return await this.prisma.clientAddress.findMany();
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }

  async findAllSenderAddresses(): Promise<ClientAddress[] | null> {
    try {
      return await this.prisma.senderAddress.findMany();
    } catch (error: any) {
      console.error(error);
      return error;
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
      });
    } catch (error: any) {
      console.error(error);
      return error;
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
          ...(invoiceUpdates as Prisma.Without<
            Prisma.InvoiceUpdateInput,
            Prisma.InvoiceUncheckedUpdateInput
          > &
            Prisma.InvoiceUncheckedUpdateInput),
          items: {
            createMany: {
              data: invoiceUpdates.items as
                | Prisma.ItemCreateManyInvoiceInput
                | Prisma.ItemCreateManyInvoiceInput[],
              skipDuplicates: true,
            },
          },
        },
        include: {
          items: true,
          clientAddress: true,
          senderAddress: true,
        },
      });
      console.log(updatedInvoice);
      return updatedInvoice as unknown as Invoice;
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }

  async create(invoice: Invoice): Promise<Invoice>
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
              name: item.name,
              price: Number(item.price),
              quantity: Number(item.quantity),
              total: item.total,
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

      return validateInvoiceData(result);
    } catch (error) {
      console.log(error);
      throw new GraphQLError(
        "Creating the invoice failed. Make sure the id is unique",
        {
          extensions: {
            code: "BAD_INVOICE_INPUT",
            invalidinvoice: invoice.id,
            error,
          },
        },
      );
    }
  }

  async deleteInvoice(id: string) {
    try {
      return await this.prisma.invoice.delete({
        where: {
          id,
        },
      });
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }

}
