import type { ApolloServerPlugin } from "@apollo/server";
import { Kind, type FragmentDefinitionNode } from "graphql";
import type { InjectedQueryContext } from "../constants/types";
import { requireSingleDemoMutation } from "../services/demoSessionPolicy";

/**
 * Refuses a temporary session's multi-field mutation request once it is
 * parsed, validated and its operation chosen, before any resolver runs: one
 * error, HTTP 400, no coordinated transaction. Batched HTTP requests stay
 * disabled (Apollo's default), and each would pass through here anyway.
 */
export const singleDemoMutationPlugin: ApolloServerPlugin = {
  requestDidStart: () =>
    Promise.resolve({
      didResolveOperation: ({ contextValue, operation, document }) => {
        requireSingleDemoMutation(
          (contextValue as InjectedQueryContext).user,
          operation,
          (name) =>
            document.definitions.find(
              (definition): definition is FragmentDefinitionNode =>
                definition.kind === Kind.FRAGMENT_DEFINITION &&
                definition.name.value === name,
            ),
        );
        return Promise.resolve();
      },
    }),
};
