import { GraphQLError } from "graphql";
import type { InjectedQueryContext } from "../constants/types";
import { ForbiddenException } from "../config/exception.config";

export function getDemoResolvers() {
  return {
    Mutation: {
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
