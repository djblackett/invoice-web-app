import { GraphQLError } from "graphql/error/GraphQLError";
import { InvoiceService } from "../services/invoice.service";
import {
  GetInvoiceByIdArgs,
  Invoice,
  InvoiceCreateArgs,
  MarkAsPaidArgs,
  PrismaContext,
  QueryContext,
} from "../constants/types";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

export function getInvoiceResolvers(invoiceService: InvoiceService) {
  return {
    Query: {
      allInvoices: async (
        _parent: unknown,
        _args: never,
        _context: PrismaContext,
      ) => {
        console.log("entered allInvoices resolver");
        try {
          const result = await invoiceService.getInvoices();
          console.log(result);
          return result;
        } catch (error) {
          console.error(error);
          return error;
        }
      },
      getInvoiceById: async (_root: never, args: GetInvoiceByIdArgs) => {
        const invoice = await invoiceService.getInvoiceById(args.id);
        if (invoice) {
          return invoice;
        } else {
          throw new GraphQLError("Invoice not found");
        }
      },
    },
    Mutation: {
      addInvoice: async (_root: never, args: InvoiceCreateArgs) => {
        try {
          console.log("args:", args);
          const newInvoice = await invoiceService.addInvoice(args);
          await pubsub.publish("INVOICE_ADDED", { invoiceAdded: newInvoice });
          return newInvoice;
        } catch (error) {
          console.error(error);
          return error;
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
              code: "BAD_INVOICE_INPUT",
              invalidArgs: args,
            },
          });
        }
        try {
          const result = await invoiceService.updateInvoice(args.id, update);
          console.log("edit invoice - result from resolver", result);
          return result;
        } catch (error) {
          console.log(error);
          return error;
        }
      },
      //

      removeInvoice: async (
        _root: unknown,
        args: GetInvoiceByIdArgs,
        _context: QueryContext,
      ) => {
        try {
          return invoiceService.deleteInvoice(args.id);
        } catch (error) {
          console.error(error);
          //  return error;
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
      markAsPaid: async (_root: unknown, args: MarkAsPaidArgs) => {
        try {
          return invoiceService.markAsPaid(args.id);
        } catch (error) {
          console.error(error);
          return error;
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
