import {prisma} from "../../index";
import {Prisma } from "@prisma/client";
import { PrismaClient} from "@prisma/client";
import {
  CreateUserArgs,
  GetInvoiceByIdArgs,
  Invoice,
  InvoiceCreateArgs,
  LoginArgs, MarkAsPaidArgs,
  ReturnedUser,
  User
} from "../types";
import {GraphQLError} from "graphql/error";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {PubSub} from "graphql-subscriptions";
const pubsub = new PubSub();

interface PrismaContext {
  prisma: PrismaClient
}


const resolvers = {
  Query: {
    allInvoices: async (_parent: any, _args: any, context: PrismaContext) => {
      try {

        console.log("context:", context);
        // console.log("context.prisma:", context.prisma);
        const response = await prisma.invoice.findMany({
          include: {
            items: true,
            clientAddress: true,
            senderAddress: true
          }
        });
        console.log("response:", response);
        // console.log(response[0].clientAddress);
        return response;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    getInvoiceById: async (_root: any, args: GetInvoiceByIdArgs) => {
      const invoice = await prisma.invoice.findUnique({
        where: {
          id: args.id
        },
        include: {
          items: true,
          clientAddress: true,
          senderAddress: true
        }
      });

      if (invoice) {
        return invoice;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        throw new GraphQLError("Invoice not found");
      }
    },
    getAllClientAddresses: async () => {

      try {
        return prisma.clientAddress.findMany();
      } catch (error) {
        throw new GraphQLError("Couldn't fetch clientAddresses", {
          extensions: {
            error: error
          }
        });
      }
    },
    getAllSenderAddresses: async () => {

      try {
        return prisma.senderAddress.findMany();
      } catch (error) {
        throw new GraphQLError("Couldn't fetch senderAddresses", {
          extensions: {
            error: error
          }
        });
      }
    },
    allUsers: async () => {
      try {
        return prisma.user.findMany();
      } catch (error) {
        throw new GraphQLError("Couldn't fetch users", {
          extensions: {
            error: error
          }
        });
      }
    }
  },
  Mutation: {
    addInvoice: async (_root: any, args: InvoiceCreateArgs) => {

      try {
        const invoiceData = await prisma.invoice.create({
          data: {
            clientEmail: args.clientEmail,
            clientName: args.clientName,
            createdAt: args.createdAt,
            description: args.description,
            id: args.id,
            paymentDue: args.paymentDue,
            paymentTerms: args.paymentTerms,
            status: args.status,
            total: args.total,
            clientAddress: {
              create: {
                city: args.clientAddress.city,
                country: args.clientAddress.country,
                postCode: args.clientAddress.postCode,
                street: args.clientAddress.street
              }
            },
            senderAddress: {
              create: {
                city: args.senderAddress.city,
                country: args.senderAddress.country,
                postCode: args.senderAddress.postCode,
                street: args.senderAddress.street
              }
            },
            items: {
              //ts-ignore
              create: args.items.map(item => ({
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
        console.log(invoiceData);
        return invoiceData;
      } catch (error) {
        console.log(error);
        throw new GraphQLError("Creating the invoice failed. Make sure the id is unique", {
          extensions: {
            code: "BAD_INVOICE_INPUT",
            invalidArgs: args.id,
            error
          }
        });
      }

    },
    editInvoice: async (_parent: any, args: Partial<Invoice>): Promise<Invoice> => {
      // args contain all the potential fields for the invoice update
      console.log(
          args
      );

      // Build an update object dynamically
      const update: Partial<Invoice> = {};

      Object.keys(args).forEach((key) => {
        const argKey = key as keyof (Partial<Invoice>);
        if (args[argKey] !== undefined && argKey !== 'id') {

          // This type assertion should be safe because the two interfaces' keys mirror each other
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/ban-ts-comment
          // @ts-ignore
          update[argKey] = args[argKey];
        }
      });

      // Deleting the items before updating to ensure that new copies are made. Prisma makes updating items and
      // adding new ones at the same time really difficult.

      try {
        if (update.items && update?.items?.length >= 1) {
          await prisma.invoice.update({
            where: {
              id: args.id
            },
            data: {
              items: {
                deleteMany: {}
              }
            }
          });
          console.log("Original items deleted");
        }

        const updatedInvoice = await prisma.invoice.update({
          where: {
            id: args.id
          },
          data: {
            ...update as (Prisma.Without<Prisma.InvoiceUpdateInput, Prisma.InvoiceUncheckedUpdateInput> &
                Prisma.InvoiceUncheckedUpdateInput),
            items: {
              createMany: {
                data: update.items as (Prisma.ItemCreateManyInvoiceInput | Prisma.ItemCreateManyInvoiceInput[]),
                skipDuplicates: true
              },
            }
          },
          include: {
            items: true,
            clientAddress: true,
            senderAddress: true
          }
        });

        console.log(updatedInvoice);

        return updatedInvoice as unknown as Invoice;

      } catch (error) {
        console.log(error);
        throw new GraphQLError("Invoice could not be updated", {
          extensions: {
            code: "BAD_INVOICE_INPUT",
            invalidArgs: args,
            error
          }
        });
      }
    },

    removeInvoice: async (_root: any, args: GetInvoiceByIdArgs) => {

      try {
        const deletedInvoice = await prisma.invoice.delete({
          where: {
            id: args.id,
          }
        });
        console.log(deletedInvoice);
        return deletedInvoice.id;
      } catch (error) {
        throw new GraphQLError("Invoice could not be removed. Invoice may not exist", {
          extensions: {
            code: "BAD_INVOICE_INPUT",
            invalidArgs: args.id,
            error
          }
        });
      }
    },
    createUser: async (_root: any, args: CreateUserArgs) => {
      // const user = new User({username: args.username, favoriteGenre: args.favoriteGenre});

      const hashedPassword = await bcrypt.hash(args.password, 10);

      const user = await prisma.user.create({
        data: {
          name: args.name,
          username: args.username,
          passwordHash: hashedPassword
        }
      }).catch((error: unknown) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error
          }
        });
      });


      const userNoPassword: ReturnedUser = {id: user.id, name: user.name, username: user.username};
      return userNoPassword;
    },

    login: async (_root: any, args: LoginArgs) => {

      const user: User | null = await prisma.user.findUnique({
        where: {
          username: args.username
        }
      });

      if (!user) {
        throw new GraphQLError("User does not exist", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        });
      }

      if (!process.env.JWT_SECRET) {
        console.log("Server env secret not set");
        return;
      }

      try {
        const match = await bcrypt.compare(args.password, user.passwordHash);
        if (match) {

          return {value: jwt.sign(JSON.stringify(user), process.env.JWT_SECRET)};

        } else {
          throw new GraphQLError("wrong credentials", {
            extensions: {
              code: "BAD_USER_INPUT"
            }
          });
        }
      } catch (e) {
        console.error(e);
        return;
      }
    },
    markAsPaid: async (_root: any, args: MarkAsPaidArgs) => {

      const result = await prisma.invoice.update({
        where : {
          id: args.id
        }, data: {
          status: "paid"
        }
      });

      return result;
    }
  },


  Subscription: {
    invoiceAdded: {
      subscribe: () => {
        console.log("inside subscribe resolver");
        return pubsub.asyncIterator("INVOICE_ADDED");
      }
      },
  }
};

export default resolvers;
