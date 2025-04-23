import { GraphQLError } from "graphql/error/GraphQLError";
import {
  GetInvoiceByIdArgs,
  InjectedQueryContext,
  Invoice,
  InvoiceCreateArgs,
  MarkAsPaidArgs,
} from "../constants/types";
import { NotFoundException } from "../config/exception.config";

export function getInvoiceResolvers() {
  return {
    Query: {
      allInvoices: async (
        _root: object,
        _parent: object,
        context: InjectedQueryContext,
      ) => {
        try {
          const { user, invoiceService } = context;

          if (!user) {
            console.error("User not found in context");
            throw new GraphQLError("Internal server error", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            });
          }

          if (!invoiceService) {
            console.error("Invoice service not found in context");
            throw new GraphQLError("Internal server error", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            });
          }

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

      getInvoiceById: async (
        _root: object,
        args: GetInvoiceByIdArgs,
        context: InjectedQueryContext,
      ) => {
        const { invoiceService } = context;
        if (!invoiceService) {
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
        try {
          const result = await invoiceService.getInvoiceById(args.id);
          return result;
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw new GraphQLError(error.message, {
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
      addInvoice: async (
        _root: object,
        args: InvoiceCreateArgs,
        context: InjectedQueryContext,
      ) => {
        const { invoiceService, pubsub } = context;
        if (!invoiceService || !pubsub) {
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
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
      editInvoice: async (
        _parent: unknown,
        args: Partial<Invoice>,
        context: InjectedQueryContext,
      ) => {
        const { invoiceService } = context;

        if (!invoiceService) {
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
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

      removeInvoice: async (
        _root: object,
        args: GetInvoiceByIdArgs,
        context: InjectedQueryContext,
      ) => {
        const { invoiceService } = context;
        if (!invoiceService) {
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
        try {
          const result = await invoiceService.deleteInvoice(args.id);
          return result;
        } catch (error) {
          console.error(error);
          if (error instanceof NotFoundException) {
            throw new GraphQLError("Invoice not found", {
              extensions: {
                code: "NOT_FOUND",
                invalidArgs: args.id,
              },
            });
          } else {
            throw new GraphQLError("Invoice could not be removed", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            });
          }
        }
      },
      deleteAllInvoices: async (
        _root: object,
        _args: GetInvoiceByIdArgs,
        context: InjectedQueryContext,
      ) => {
        if (
          context.user?.role !== "ADMIN" &&
          process.env["NODE_ENV"] !== "test"
        ) {
          throw new GraphQLError("Unauthorized", {
            extensions: {
              code: "UNAUTHORIZED",
            },
          });
        }

        const { invoiceService } = context;
        if (!invoiceService) {
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
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

      deleteInvoicesByUserId: async (
        _root: object,
        _args: GetInvoiceByIdArgs,
        context: InjectedQueryContext,
      ) => {
        const { user, invoiceService } = context;

        if (user?.role !== "ADMIN") {
          throw new GraphQLError(
            "Unauthorized - must be ADMIN, but user is " + user?.role,
            {
              extensions: {
                code: "UNAUTHORIZED",
              },
            },
          );
        }

        if (!invoiceService) {
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }

        try {
          const result = await invoiceService.deleteInvoicesByUserId();
          return result;
        } catch (error) {
          console.error(error);
          throw new GraphQLError("Failed to delete invoices by user id", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      },

      markAsPaid: async (
        _root: unknown,
        args: MarkAsPaidArgs,
        context: InjectedQueryContext,
      ) => {
        const { invoiceService } = context;
        if (!invoiceService) {
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
        try {
          const result = await invoiceService.markAsPaid(args.id);
          return result;
        } catch (error) {
          console.error(error);
          if (error instanceof NotFoundException) {
            throw new GraphQLError("Invoice not found", {
              extensions: {
                code: "NOT_FOUND",
                invalidArgs: args.id,
              },
            });
          }
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
        subscribe: async (
          _root: never,
          _args: never,
          context: InjectedQueryContext,
        ) => {
          const { pubsub, user } = context;
          if (!pubsub) {
            throw new GraphQLError("Internal server error : pubsub missing", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            });
          }

          if (user?.role !== "ADMIN") {
            throw new GraphQLError("Not authorized to subscribe", {
              extensions: { code: "FORBIDDEN" },
            });
          }
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
