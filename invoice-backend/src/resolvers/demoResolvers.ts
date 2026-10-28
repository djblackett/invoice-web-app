import { GraphQLError } from "graphql";
import type { InjectedQueryContext } from "../constants/types";
import { ForbiddenException } from "../config/exception.config";

export function getDemoResolvers() {
  return {
    Mutation: {
      // Temporary sessions never reach this resolver: the mutation wrapper
      // routes them to their coordinated handler by name. Everyone else,
      // ordinary users, administrators and the shared demo user alike, is
      // refused here.
      resetDemoSession: () => {
        throw new GraphQLError(
          "Only temporary demo sessions can reset a demo workspace",
          { extensions: { code: "FORBIDDEN" } },
        );
      },
      resetDemoData: async (
        _root: unknown,
        _args: unknown,
        context: InjectedQueryContext,
      ) => {
        if (!context.demoService)
          throw new GraphQLError("Demo authentication required", {
            extensions: { code: "FORBIDDEN" },
          });
        try {
          return await context.demoService.reset();
        } catch (error) {
          if (error instanceof ForbiddenException)
            throw new GraphQLError(error.message, {
              extensions: { code: "FORBIDDEN" },
            });
          throw new GraphQLError("Demo data could not be reset", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      },
    },
  };
}
