import type {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextDidEncounterErrors,
} from "@apollo/server";
import type { Logger } from "../config/logger.config";

// Create a logging plugin for Apollo Server
// ChatGPT and Copilot wrote most of this code

export function createLoggingPlugin(logger: Logger): ApolloServerPlugin {
  // Add this line to check the environment variable
  const loggingEnabled = process.env["LOG_GRAPHQL"] !== "false";

  return {
    async requestDidStart(requestContext: GraphQLRequestContext<BaseContext>) {
      if (!loggingEnabled) {
        return {};
      }

      const operationName =
        requestContext.request.operationName || "Unnamed Operation";
      const startTime = Date.now();
      logger.info(`Starting GraphQL request: ${operationName}`);

      try {
        return await Promise.resolve({
          didEncounterErrors(
            ctx: GraphQLRequestContextDidEncounterErrors<BaseContext>,
          ): Promise<void> {
            logger.error(
              `Errors encountered in ${operationName}: ${JSON.stringify(ctx.errors)}`,
            );
            return Promise.resolve();
          },
          willSendResponse(): Promise<void> {
            const duration = Date.now() - startTime;
            logger.info(
              `Completed GraphQL request: ${operationName} in ${duration}ms`,
            );
            return Promise.resolve();
          },
        });
      } catch (error: unknown) {
        logger.error(
          `Error in requestDidStart for ${operationName}: ${error instanceof Error ? error.message : String(error)}`,
        );
        return Promise.resolve();
      }
    },
  };
}
