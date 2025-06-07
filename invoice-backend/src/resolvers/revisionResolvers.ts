import { GraphQLError } from "graphql/error/GraphQLError";
import type { InjectedQueryContext } from "../constants/types";
import { NotFoundException, ValidationException } from "../config/exception.config";

export interface GetInvoiceRevisionsArgs {
  invoiceId: string;
  filters?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    changeType?: string;
  };
}

export interface GetRevisionDiffArgs {
  invoiceId: string;
  fromRevision: number;
  toRevision: number;
}

export interface RestoreInvoiceArgs {
  invoiceId: string;
  revisionNumber: number;
}

export function getRevisionResolvers() {
  return {
    Query: {
      getInvoiceRevisions: async (
        _root: object,
        args: GetInvoiceRevisionsArgs,
        context: InjectedQueryContext,
      ) => {
        const { revisionService } = context;
        if (!revisionService) {
          throw new GraphQLError("Internal server error: revisionService doesn't exist", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }

        try {
          const filters = args.filters ? {
            ...(args.filters.startDate && { startDate: new Date(args.filters.startDate) }),
            ...(args.filters.endDate && { endDate: new Date(args.filters.endDate) }),
            ...(args.filters.userId && { userId: args.filters.userId }),
            ...(args.filters.changeType && { changeType: args.filters.changeType }),
          } : undefined;

          const revisions = await revisionService.getInvoiceRevisions(args.invoiceId, filters);
          
          return revisions.map((revision: any) => ({
            ...revision,
            createdAt: revision.createdAt.toISOString(),
            jsonDiff: revision.jsonDiff ? JSON.stringify(revision.jsonDiff) : null,
            fullSnapshot: JSON.stringify(revision.fullSnapshot)
          }));
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw new GraphQLError(error.message, {
              extensions: {
                code: "NOT_FOUND",
              },
            });
          }
          if (error instanceof ValidationException) {
            throw new GraphQLError(error.message, {
              extensions: {
                code: "UNAUTHORIZED",
              },
            });
          }
          console.error(error);
          throw new GraphQLError("Failed to retrieve invoice revisions", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      },

      getRevisionDiff: async (
        _root: object,
        args: GetRevisionDiffArgs,
        context: InjectedQueryContext,
      ) => {
        const { revisionService } = context;
        if (!revisionService) {
          throw new GraphQLError("Internal server error: revisionService doesn't exist", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }

        try {
          const diff = await revisionService.getRevisionDiff(
            args.invoiceId,
            args.fromRevision,
            args.toRevision
          );

          return {
            fromRevision: args.fromRevision,
            toRevision: args.toRevision,
            diff: JSON.stringify(diff)
          };
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw new GraphQLError(error.message, {
              extensions: {
                code: "NOT_FOUND",
              },
            });
          }
          if (error instanceof ValidationException) {
            throw new GraphQLError(error.message, {
              extensions: {
                code: "UNAUTHORIZED",
              },
            });
          }
          console.error(error);
          throw new GraphQLError("Failed to get revision diff", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      },
    },

    Mutation: {
      restoreInvoiceToRevision: async (
        _root: object,
        args: RestoreInvoiceArgs,
        context: InjectedQueryContext,
      ) => {
        const { revisionService } = context;
        if (!revisionService) {
          throw new GraphQLError("Internal server error: revisionService doesn't exist", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }

        try {
          const restoredInvoice = await revisionService.restoreInvoiceToRevision(
            args.invoiceId,
            args.revisionNumber
          );

          return restoredInvoice;
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw new GraphQLError(error.message, {
              extensions: {
                code: "NOT_FOUND",
              },
            });
          }
          if (error instanceof ValidationException) {
            throw new GraphQLError(error.message, {
              extensions: {
                code: "UNAUTHORIZED",
              },
            });
          }
          console.error(error);
          throw new GraphQLError("Failed to restore invoice to revision", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      },
    },
  };
}
