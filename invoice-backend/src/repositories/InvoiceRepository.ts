import {DefaultArgs, GetFindResult, GetResult} from "@prisma/client/runtime/library";
import {Prisma, PrismaClient} from "@prisma/client";
import {inject, injectable} from "inversify";
import {Invoice} from "../constants/types";
import container from "../config/inversify.config";
import {DatabaseConnection} from "../database/database.connection";
import {GraphQLError} from "graphql/error";

@injectable()
export class InvoiceRepository {
    protected prisma;

    constructor(@inject(DatabaseConnection) private readonly databaseConnection: DatabaseConnection) {
        this.prisma = databaseConnection.getPrisma();
    }

    // async findAll(): Promise<GetFindResult<Prisma.$InvoicePayload<Defaultinvoice>, any>[]> {
    async findAll(): Promise<GetFindResult<Prisma.$InvoicePayload<DefaultArgs>, {
        include: { senderAddress: boolean; items: boolean; clientAddress: boolean }
    }>[]> {

        try {
            const response = await this.prisma.invoice.findMany({
                include: {
                    items: true,
                    clientAddress: true,
                    senderAddress: true
                }
            });
            // console.log("response:", response);
            return response;
        } catch (error: any) {
            console.error(error);
            return error;
        }
    }


    async create(invoice: Invoice): Promise<Prisma.Prisma__InvoiceClient<GetResult<Prisma.$InvoicePayload<DefaultArgs>, {
        include: { senderAddress: boolean; clientAddress: boolean; items: boolean };
        data: {
            createdAt: string;
            total: number;
            senderAddress: { create: { country: string; city: string; street: string; postCode: string } };
            clientEmail: string;
            clientName: string;
            description: string;
            id: string;
            paymentDue: string;
            clientAddress: { create: { country: string; city: string; street: string; postCode: string } };
            items: {
                create: { total: number; quantity: number; price: number; name: string; id: string | undefined }[]
            };
            paymentTerms: number;
            status: string
        }
    }, "create">, never, DefaultArgs>> {
        try {
                  const invoiceData = await this.prisma.invoice.create({
                    data: {
                      clientEmail: invoice.clientEmail,
                      clientName: invoice.clientName,
                      createdAt: invoice.createdAt,
                      description: invoice.description,
                      id: invoice.id,
                      paymentDue: invoice.paymentDue,
                      paymentTerms: invoice.paymentTerms,
                      status: invoice.status,
                      total: invoice.total,
                      clientAddress: {
                        create: {
                          city: invoice.clientAddress.city,
                          country: invoice.clientAddress.country,
                          postCode: invoice.clientAddress.postCode,
                          street: invoice.clientAddress.street
                        }
                      },
                      senderAddress: {
                        create: {
                          city: invoice.senderAddress.city,
                          country: invoice.senderAddress.country,
                          postCode: invoice.senderAddress.postCode,
                          street: invoice.senderAddress.street
                        }
                      },
                      items: {
                        //ts-ignore
                        create: invoice.items.map(item => ({
                          name: item.name,
                          price: Number(item.price),
                          quantity: Number(item.quantity),
                          total: item.total,
                          id: item.id || undefined
                        }))
                      }
                    },
                    include: {
                      clientAddress: true,
                      senderAddress: true,
                      items: true
                    }
                  });

                  // await pubsub.publish("INVOICE_ADDED", {invoiceAdded: invoiceData});
                  // console.log(invoiceData)
                  return invoiceData;
                } catch (error) {
                  console.log(error);
                  throw new GraphQLError("Creating the invoice failed. Make sure the id is unique", {
                    extensions: {
                      code: "BAD_INVOICE_INPUT",
                      invalidinvoice: invoice.id,
                      error
                    }
                  });
        }
    }

}