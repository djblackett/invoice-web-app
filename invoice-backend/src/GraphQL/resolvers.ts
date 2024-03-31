import { PrismaClient } from "@prisma/client";
import {
  CreateUserArgs,
  GetInvoiceByIdArgs,
  Invoice,
  InvoiceCreateArgs,
  LoginArgs,
  MarkAsPaidArgs, QueryContext,
  ReturnedUser
} from "../constants/types";
import { GraphQLError } from "graphql/error";
import { PubSub } from "graphql-subscriptions";
import { InvoiceService } from "../services/invoice.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET } from "../config/server.config";

const pubsub = new PubSub();

interface PrismaContext {
  prisma: PrismaClient;
}

export function getResolvers(invoiceService: InvoiceService) {
  return {
    Query: {
      allInvoices: async (_parent: any, _args: any, context: PrismaContext) => {
        console.log("entered allInvoices resolver");
        try {
          return invoiceService.getInvoices();
        } catch (error) {
          console.error(error);
          return error;
        }
      },
      getInvoiceById: async (_root: any, args: GetInvoiceByIdArgs) => {
        const invoice = await invoiceService.getInvoiceById(args.id);
        if (invoice) {
          return invoice;
        } else {
          throw new GraphQLError("Invoice not found");
        }
      },
      getAllClientAddresses: async () => {
        try {
          return invoiceService.getClientAddresses();
        } catch (error) {
          throw new GraphQLError("Couldn't fetch clientAddresses", {
            extensions: {
              error: error,
            },
          });
        }
      },
      getAllSenderAddresses: async () => {
        try {
          return invoiceService.getSellerAddresses();
        } catch (error) {
          throw new GraphQLError("Couldn't fetch senderAddresses", {
            extensions: {
              error: error,
            },
          });
        }
      },
      // allUsers: async () => {
      //   try {
      //     return invoiceService.getUsers();
      //   } catch (error) {
      //     throw new GraphQLError("Couldn't fetch users", {
      //       extensions: {
      //         error: error,
      //       },
      //     });
      //   }
      // },
    },
    Mutation: {
      addInvoice: async (_root: any, args: InvoiceCreateArgs) => {
        try {
          const newInvoice = await invoiceService.addInvoice(args);
          await pubsub.publish("INVOICE_ADDED", { invoiceAdded: newInvoice });
          return newInvoice;
        } catch (error) {
          throw new GraphQLError(
            "Creating the invoice failed. Make sure the id is unique",
            {
              extensions: {
                code: "BAD_INVOICE_INPUT",
                invalidArgs: args.id,
                error,
              },
            },
          );
        }
      },
      editInvoice: async (
        _parent: any,
        args: Partial<Invoice>,
      ): Promise<Invoice> => {
        // args contain all the potential fields for the invoice update
        // Build an update object dynamically
        const update: Partial<Invoice> = {};

        Object.keys(args).forEach((key) => {
          const argKey = key as keyof Partial<Invoice>;
          if (args[argKey] !== undefined && argKey !== "id") {
            // This type assertion should be safe because the two interfaces' keys mirror each other
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/ban-ts-comment
            // @ts-ignore
            update[argKey] = args[argKey];
          }
        });

        if (!args.id) {
          throw new GraphQLError("Invoice id is required", {
            extensions: {
              code: "BAD_INVOICE_INPUT",
              invalidArgs: args,
            },
          });
        }
        try {
          await invoiceService.updateInvoice(args.id, update);
        } catch (error) {
          console.log(error);
          throw new GraphQLError("Invoice could not be updated", {
            extensions: {
              code: "BAD_INVOICE_INPUT",
              invalidArgs: args,
              error,
            },
          });
        }
        return {} as unknown as Invoice;
      },
      //
      removeInvoice: async (_root: any, args: GetInvoiceByIdArgs, context: QueryContext) => {

        try {
          return invoiceService.deleteInvoice(args.id);
        } catch (error) {
          throw new GraphQLError(
            "Invoice could not be removed. Invoice may not exist",
            {
              extensions: {
                code: "BAD_INVOICE_INPUT",
                invalidArgs: args.id,
                error,
              },
            },
          );
        }
      },
      // createUser: async (_root: any, args: CreateUserArgs) => {
      //   const user = await invoiceService.createUser(args);
      //   const userNoPassword: ReturnedUser = {
      //     id: user.id,
      //     name: user.name,
      //     username: user.username,
      //   };
      //   return userNoPassword;
      // },
      //
      // login: async (_root: any, args: LoginArgs) => {
      //   const user = await invoiceService.login(args.username, args.password);
      //
      //   if (!user) {
      //     throw new GraphQLError("User does not exist", {
      //       extensions: {
      //         code: "BAD_USER_INPUT",
      //       },
      //     });
      //   }
      //
      //   console.log(user);
      //
      //   if (!SECRET) {
      //     console.log("Server env secret not set");
      //     return;
      //   }
      //
      //
      //     console.log("before match");
      //     const match = await bcrypt.compare(args.password, user.passwordHash);
      //
      //     console.log("match:", match);
      //     if (match) {
      //       // let jwt;
      //       return {
      //         value: jwt.sign(JSON.stringify(user), SECRET),
      //       };
      //     } else {
      //       throw new GraphQLError("wrong credentials", {
      //         extensions: {
      //           code: "BAD_USER_INPUT",
      //         },
      //       });
      //     }
      //   }
      // ,
      markAsPaid: async (_root: any, args: MarkAsPaidArgs) => {
        try {
          return invoiceService.markAsPaid(args.id);
        } catch (error) {
          throw new GraphQLError("Invoice could not be marked as paid", {
            extensions: {
              code: "BAD_INVOICE_INPUT",
              invalidArgs: args.id,
              error,
            },
          });
        }
      },
    },
    Subscription: {
      invoiceAdded: {
        subscribe: async () => {
          console.log("inside subscribe resolver");
          return pubsub.asyncIterator("INVOICE_ADDED");
        },
      },
    },
  };
}
