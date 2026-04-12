import { GraphQLError } from "graphql/error/GraphQLError";
import { NotFoundException, ValidationException } from "../config/exception.config";
import type { InjectedQueryContext } from "../constants/types";
import type { StoredRevision } from "../repositories/InvoiceRevisionRepo";

/**
 * Shape the backend revision record into the GraphQL schema shape. The
 * snapshot is already a plain JSON structure matching `InvoiceSnapshot`
 * — we just forward it and ISO-string the timestamp.
 */
function serializeRevision(r: StoredRevision) {
  return {
    id: r.id,
    invoiceId: r.invoiceId,
    revisionNumber: r.revisionNumber,
    createdAt: r.createdAt.toISOString(),
    createdBy: r.createdBy
      ? {
          id: r.createdBy.id,
          username: r.createdBy.username,
          name: r.createdBy.name,
        }
      : null,
    changeType: r.changeType,
    restoredFromRevisionId: r.restoredFromRevisionId,
    message: r.message,
    snapshot: r.snapshot,
  };
}

function toGraphQLError(error: unknown, fallback: string): GraphQLError {
  if (error instanceof NotFoundException) {
    return new GraphQLError(error.message, {
      extensions: { code: "NOT_FOUND" },
    });
  }
  if (error instanceof ValidationException) {
    return new GraphQLError(error.message, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  console.error(error);
  return new GraphQLError(fallback, {
    extensions: { code: "INTERNAL_SERVER_ERROR" },
  });
}

function requireRevisionService(context: InjectedQueryContext) {
  if (!context.invoiceRevisionService) {
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
  return context.invoiceRevisionService;
}

function requireInvoiceService(context: InjectedQueryContext) {
  if (!context.invoiceService) {
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
  return context.invoiceService;
}

/**
 * Resolvers for invoice revision history. Kept in a separate module so
 * that the invoice feature and the revision feature remain loosely
 * coupled — merged into the resolver map in `invoiceResolvers.ts`.
 */
export function getInvoiceRevisionResolvers() {
  return {
    Query: {
      invoiceRevisions: async (
        _root: unknown,
        args: { invoiceId: string },
        context: InjectedQueryContext,
      ) => {
        const svc = requireRevisionService(context);
        const invoiceService = requireInvoiceService(context);
        try {
          // Enforce that the caller can see this invoice before exposing
          // its history; re-using the service guards us for free.
          await invoiceService.getInvoiceById(args.invoiceId);
          const revisions = await svc.listRevisions(args.invoiceId);
          return revisions.map(serializeRevision);
        } catch (err) {
          throw toGraphQLError(err, "Failed to fetch invoice revisions");
        }
      },
      invoiceRevision: async (
        _root: unknown,
        args: { id: string },
        context: InjectedQueryContext,
      ) => {
        const svc = requireRevisionService(context);
        try {
          const revision = await svc.getRevision(args.id);
          return serializeRevision(revision);
        } catch (err) {
          throw toGraphQLError(err, "Failed to fetch revision");
        }
      },
      invoiceRevisionDiff: async (
        _root: unknown,
        args: { fromRevisionId?: string | null; toRevisionId: string },
        context: InjectedQueryContext,
      ) => {
        const svc = requireRevisionService(context);
        try {
          return await svc.getDiff(
            args.fromRevisionId ?? null,
            args.toRevisionId,
          );
        } catch (err) {
          throw toGraphQLError(err, "Failed to compute diff");
        }
      },
    },
    Mutation: {
      restoreInvoiceRevision: async (
        _root: unknown,
        args: { invoiceId: string; revisionId: string },
        context: InjectedQueryContext,
      ) => {
        const invoiceService = requireInvoiceService(context);
        try {
          return await invoiceService.restoreRevision(
            args.invoiceId,
            args.revisionId,
          );
        } catch (err) {
          throw toGraphQLError(err, "Failed to restore revision");
        }
      },
    },
  };
}
