import { GraphQLError } from "graphql/error/GraphQLError";
import { InvoiceService } from "../services/invoice.service";
import {
  GetInvoiceByIdArgs,
  Invoice,
  InvoiceCreateArgs,
  MarkAsPaidArgs,
  QueryContext,
} from "../constants/types";
import { PubSub } from "graphql-subscriptions";

export function getInvoiceResolvers(
  invoiceService: InvoiceService,
  pubsub: PubSub,
) {
  return {
    Query: {
      allInvoices: async () => {
        try {
          const result = await invoiceService.getInvoices();
          return result;
        } catch (error) {
          console.error(error);
          throw new GraphQLError("Failed to retrieve invoices", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      },
      getInvoiceById: async (_root: never, args: GetInvoiceByIdArgs) => {
        const invoice = await invoiceService.getInvoiceById(args.id);
        if (invoice) {
          return invoice;
        } else {
          throw new GraphQLError("Invoice not found", {
            extensions: {
              code: "NOT_FOUND",
            },
          });
        }
      },
    },
    Mutation: {
      addInvoice: async (_root: never, args: InvoiceCreateArgs) => {
        try {
          const newInvoice = await invoiceService.addInvoice(args);
          await pubsub.publish("INVOICE_ADDED", { invoiceAdded: newInvoice });
          return newInvoice;
        } catch (error) {
          console.error(error);
          throw new GraphQLError("Failed to add invoice", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      },
      editInvoice: async (_parent: unknown, args: Partial<Invoice>) => {
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
              code: "BAD_USER_INPUT",
              invalidArgs: args,
            },
          });
        }
        try {
          const result = await invoiceService.updateInvoice(args.id, update);
          return result;
        } catch (error) {
          console.error(error);
          throw new GraphQLError("Failed to update invoice", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      },
      //

      removeInvoice: async (
        _root: unknown,
        args: GetInvoiceByIdArgs,
        _context: QueryContext,
      ) => {
        try {
          return await invoiceService.deleteInvoice(args.id);
        } catch (error) {
          console.error(error);
          throw new GraphQLError(
            "Invoice could not be removed. Invoice may not exist",
            {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: args.id,
              },
            },
          );
        }
      },
      markAsPaid: async (_root: unknown, args: MarkAsPaidArgs) => {
        try {
          const result = await invoiceService.markAsPaid(args.id);
          if (!result) {
            throw new GraphQLError("Invoice not found", {
              extensions: {
                code: "NOT_FOUND",
                invalidArgs: args.id,
              },
            });
          }
          return result;
        } catch (error) {
          console.error(error);
          throw new GraphQLError("Invoice could not be marked as paid", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      },
    },
    Subscription: {
      invoiceAdded: {
        subscribe: async () => {
          try {
            return pubsub.asyncIterator("INVOICE_ADDED");
          } catch (error) {
            console.error(error);
            throw new GraphQLError("Failed to subscribe to invoiceAdded", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            });
          }
        },
      },
    },
  };
}
