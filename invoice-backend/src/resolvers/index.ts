import { GraphQLError } from "graphql";
import { ForbiddenException } from "../config/exception.config";
import {
  requireDemoMutationAllowed,
  requireHttpForDemoMutation,
} from "../services/demoSessionPolicy";
import type { InjectedQueryContext } from "../constants/types";
import { getDemoResolvers } from "./demoResolvers";
import { getInvoiceResolvers } from "./invoiceResolvers";
import { getInvoiceRevisionResolvers } from "./invoiceRevisionResolvers";
import { getUserResolvers } from "./userResolvers";

export function getResolvers() {
  const invoiceResolvers = getInvoiceResolvers();
  const revisionResolvers = getInvoiceRevisionResolvers();
  const userResolvers = getUserResolvers();

  return {
    Query: {
      ...invoiceResolvers.Query,
      ...revisionResolvers.Query,
      ...userResolvers.Query,
    },
    Mutation: Object.fromEntries(
      Object.entries({
        ...invoiceResolvers.Mutation,
        ...getDemoResolvers().Mutation,
        ...revisionResolvers.Mutation,
        ...userResolvers.Mutation,
      }).map(([name, resolver]) => [
        name,
        (...args: [unknown, unknown, InjectedQueryContext]) => {
          try {
            // `connection` is set only by the server's WebSocket context.
            requireHttpForDemoMutation(args[2].user, !!args[2].connection);
            requireDemoMutationAllowed(args[2].user);
          } catch (e) {
            throw new GraphQLError(
              e instanceof ForbiddenException
                ? e.message
                : "Temporary demo sessions are read-only",
              { extensions: { code: "FORBIDDEN" } },
            );
          }
          // Preserve each resolver's argument contract; the wrapper only inspects context.
          return (
            resolver as (
              root: unknown,
              input: unknown,
              context: InjectedQueryContext,
            ) => unknown
          )(...args);
        },
      ]),
    ),
    Subscription: {
      ...invoiceResolvers.Subscription,
    },
  };
}
