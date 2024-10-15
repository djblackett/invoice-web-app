import { GraphQLError } from "graphql/error/GraphQLError";
import { InvoiceService } from "../services/invoice.service";
import {
  GetInvoiceByIdArgs,
  Invoice,
  InvoiceCreateArgs,
  MarkAsPaidArgs,
} from "../constants/types";
import { PubSub } from "graphql-subscriptions";
import { NotFoundException } from "../config/exception.config";

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
        try {
          const result = await invoiceService.getInvoiceById(args.id);
            return result;
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw new GraphQLError("Invoice not found", {
              extensions: {
                code: "NOT_FOUND",
              },
            });
          }
          console.error(error);
          throw new GraphQLError("Failed to retrieve invoice", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
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
        if (!args.id) {
          throw new GraphQLError("Invoice id is required", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args,
            },
          });
        }

        const { id, ...update } = args;

        try {
          const result = await invoiceService.updateInvoice(id, update);
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

      removeInvoice: async (_root: never, args: GetInvoiceByIdArgs) => {
        try {
          const result = await invoiceService.deleteInvoice(args.id);
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
          throw new GraphQLError("Invoice could not be removed", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      },
      deleteAllInvoices: async () => {
        try {
          const result = await invoiceService.deleteAllInvoices();
          if (result) {
            return { acknowledged: true };
          } else {
            return { acknowledged: false };
          }
        } catch (error) {
          console.error(error);
          throw new GraphQLError("Failed to delete all invoices", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
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
