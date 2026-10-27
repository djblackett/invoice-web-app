import { GraphQLError } from "graphql";
import type { PrismaClient } from "@prisma/client";
import TYPES from "../constants/identifiers";
import type { InjectedQueryContext, Invoice } from "../constants/types";
import {
  ForbiddenException,
  NotFoundException,
  ValidationException,
} from "../config/exception.config";
import type { InvoiceService } from "../services/invoice.service";
import type { DemoInvoiceOperation } from "../services/demoSessionPolicy";
import {
  DemoSessionWriteError,
  runDemoInvoiceWrite,
  type DemoInvoiceRequest,
  type PreparedDemoInvoiceRequest,
} from "../services/demoSessionWrite";

type Args = Record<string, unknown>;

// Stable codes for the later browser lifecycle. Quota errors say which limit.
const WRITE_ERRORS: Record<
  DemoSessionWriteError["code"],
  { code: string; message: string; quota?: string }
> = {
  DISABLED: {
    code: "FORBIDDEN",
    message: "Temporary demo sessions are disabled",
  },
  SESSION_INVALID: {
    code: "UNAUTHENTICATED",
    message: "Demo session has expired or is no longer valid",
  },
  SESSION_BUSY: {
    code: "SESSION_BUSY",
    message: "Another change to this demo is in progress; try again",
  },
  ATTEMPT_BUDGET: {
    code: "QUOTA_EXCEEDED",
    message: "This demo session has made too many change attempts",
    quota: "attempts",
  },
  MUTATION_BUDGET: {
    code: "QUOTA_EXCEEDED",
    message: "This demo session has no changes remaining",
    quota: "mutations",
  },
  WORKSPACE_QUOTA: {
    code: "QUOTA_EXCEEDED",
    message: "This change would exceed the demo workspace limits",
    quota: "workspace",
  },
  // Reset is not an invoice operation; unreachable here until Slice 3C.
  RESET_ALLOWANCE: { code: "FORBIDDEN", message: "Reset is not available" },
  RESET_COOLDOWN: { code: "FORBIDDEN", message: "Reset is not available" },
};

/**
 * Missing and foreign records share NotFoundException's fixed messages, so
 * nothing here can reveal whether another user's record exists.
 */
function toGraphQLError(error: unknown): GraphQLError {
  if (error instanceof DemoSessionWriteError) {
    const { code, message, quota } = WRITE_ERRORS[error.code];
    return new GraphQLError(message, {
      extensions: { code, ...(quota ? { quota } : {}) },
    });
  }
  if (error instanceof ValidationException)
    return new GraphQLError(error.message, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  if (error instanceof NotFoundException)
    return new GraphQLError(error.message, {
      extensions: { code: "NOT_FOUND" },
    });
  if (error instanceof ForbiddenException)
    return new GraphQLError(error.message, {
      extensions: { code: "FORBIDDEN" },
    });
  console.error(error);
  return new GraphQLError("Demo invoice operation failed", {
    extensions: { code: "INTERNAL_SERVER_ERROR" },
  });
}

function coordinated<O extends DemoInvoiceOperation, T>(
  operation: O,
  toRequest: (args: Args) => DemoInvoiceRequest,
  run: (
    invoices: InvoiceService,
    prepared: PreparedDemoInvoiceRequest<O>,
  ) => Promise<T>,
) {
  return async (args: Args, context: InjectedQueryContext): Promise<T> => {
    const { user, container } = context;
    if (!user || !container)
      throw new GraphQLError("Demo session required", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    try {
      return await runDemoInvoiceWrite(
        container.get<PrismaClient>(TYPES.PrismaClient),
        container,
        user,
        operation,
        toRequest(args),
        (scope, prepared) =>
          run(scope.get<InvoiceService>(TYPES.InvoiceService), prepared),
      );
    } catch (error) {
      throw toGraphQLError(error);
    }
  };
}

/**
 * The complete set of mutations a temporary session can perform, each one a
 * coordinated, quota-enforced write over HTTP. They never publish to the
 * administrator `invoiceAdded` feed. Every other mutation stays denied.
 */
export const temporarySessionMutations: ReadonlyMap<
  string,
  (args: Args, context: InjectedQueryContext) => Promise<unknown>
> = new Map<
  string,
  (args: Args, context: InjectedQueryContext) => Promise<unknown>
>([
  [
    "addInvoice",
    coordinated(
      "create",
      (invoice) => ({ invoice }),
      // The service fills defaults for the fields an incomplete draft omits.
      (invoices, { invoice }) => invoices.addInvoice(invoice as Invoice),
    ),
  ],
  [
    "editInvoice",
    coordinated(
      "edit",
      ({ id, ...invoice }) => ({ invoiceId: id, invoice }),
      (invoices, { invoiceId, invoice }) =>
        invoices.updateInvoice(invoiceId, invoice),
    ),
  ],
  [
    "markAsPaid",
    coordinated(
      "pay",
      ({ id }) => ({ invoiceId: id }),
      (invoices, { invoiceId }) => invoices.markAsPaid(invoiceId),
    ),
  ],
  [
    "removeInvoice",
    coordinated(
      "delete",
      ({ id }) => ({ invoiceId: id }),
      async (invoices, { invoiceId }) => ({
        acknowledged: await invoices.deleteInvoice(invoiceId),
      }),
    ),
  ],
  [
    "restoreInvoiceRevision",
    coordinated(
      "restore",
      ({ invoiceId, revisionId }) => ({ invoiceId, revisionId }),
      (invoices, { invoiceId, revisionId }) =>
        invoices.restoreRevision(invoiceId, revisionId),
    ),
  ],
]);
