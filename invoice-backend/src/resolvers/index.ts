import { defaultFieldResolver, GraphQLError, Kind } from "graphql";
import typeDefs from "../GraphQL/typeDefs";
import { ForbiddenException } from "../config/exception.config";
import {
  isTemporaryDemoUser,
  requireHttpForDemoMutation,
} from "../services/demoSessionPolicy";
import type { InjectedQueryContext } from "../constants/types";
import { getDemoResolvers } from "./demoResolvers";
import { temporarySessionMutations } from "./demoSessionMutations";
import { getInvoiceResolvers } from "./invoiceResolvers";
import { getInvoiceRevisionResolvers } from "./invoiceRevisionResolvers";
import { getUserResolvers } from "./userResolvers";

// Every schema mutation, implemented or not (e.g. `login`), so the wrapper's
// temporary-session denial cannot be skipped by a field without a resolver.
const schemaMutations = typeDefs.definitions.flatMap((definition) =>
  definition.kind === Kind.OBJECT_TYPE_DEFINITION &&
  definition.name.value === "Mutation"
    ? (definition.fields ?? []).map((field) => field.name.value)
    : [],
);

const forbidden = (message: string) =>
  new GraphQLError(message, { extensions: { code: "FORBIDDEN" } });

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
        ...Object.fromEntries(
          schemaMutations.map((name) => [name, defaultFieldResolver]),
        ),
        ...invoiceResolvers.Mutation,
        ...getDemoResolvers().Mutation,
        ...revisionResolvers.Mutation,
        ...userResolvers.Mutation,
      }).map(([name, resolver]) => [
        name,
        (...args: [unknown, unknown, InjectedQueryContext]) => {
          const [, input, context] = args;
          try {
            // `connection` is set only by the server's WebSocket context.
            requireHttpForDemoMutation(context.user, !!context.connection);
          } catch (e) {
            throw forbidden(
              e instanceof ForbiddenException
                ? e.message
                : "Temporary demo sessions are read-only",
            );
          }
          // A temporary session never reaches the ordinary resolver (or its
          // admin-feed publish): only the coordinated handlers, by name.
          if (isTemporaryDemoUser(context.user)) {
            const coordinated = temporarySessionMutations.get(name);
            if (!coordinated)
              throw forbidden(
                "Temporary demo sessions cannot use this operation",
              );
            return coordinated(input as Record<string, unknown>, context);
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
