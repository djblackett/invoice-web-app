import {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestContextDidEncounterErrors,
} from "@apollo/server";
import { Logger } from "../config/logger.config";

// Create a logging plugin for Apollo Server
// ChatGPT and Copilot wrote most of this code

export function createLoggingPlugin(logger: Logger): ApolloServerPlugin {
  return {
    async requestDidStart(requestContext: GraphQLRequestContext<any>) {
      const operationName =
        requestContext.request.operationName || "Unnamed Operation";
      const startTime = Date.now();
      logger.info(`Starting GraphQL request: ${operationName}`);

      return {
        async didEncounterErrors(
          ctx: GraphQLRequestContextDidEncounterErrors<any>,
        ) {
          logger.error(
            `Errors encountered in ${operationName}: ${JSON.stringify(ctx.errors)}`,
          );
        },
        async willSendResponse() {
          const duration = Date.now() - startTime;
          logger.info(
            `Completed GraphQL request: ${operationName} in ${duration}ms`,
          );
        },
      };
    },
  };
}
