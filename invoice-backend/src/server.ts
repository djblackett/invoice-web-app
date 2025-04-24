import http from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServer } from "@apollo/server";
import type { ContextArgs, MyContext } from "./constants/types";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { createApp } from "./app";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./GraphQL/typeDefs";
import { CERT_DIR, NODE_ENV } from "./config/server.config";
import { expressMiddleware } from "@apollo/server/express4";
import { createContext } from "./GraphQL/createContext";
import path from "path";
import fs from "fs";
import https from "https";
import { getResolvers } from "./resolvers";
import { createLoggingPlugin } from "./GraphQL/loggingPlugin";
import container from "./config/inversify.config";
import type { Logger } from "./config/logger.config";
import TYPES from "./constants/identifiers";

const isProduction = NODE_ENV === "production";
const isDemo = process.env["DEMO_MODE"] === "true";

const logger = container.get<Logger>(TYPES.Logger);

export const createServer = async () => {
  try {
    const app = await createApp();
    let httpServer;
    if (CERT_DIR && !isProduction && !isDemo) {
      const sslOptions = {
        key: fs.readFileSync(
          path.join(__dirname, CERT_DIR, "localhost-key.pem"),
          "ascii",
        ),
        cert: fs.readFileSync(
          path.join(__dirname, CERT_DIR, "localhost-fullchain.pem"),
          "ascii",
        ),
      };

      httpServer = https.createServer(sslOptions, app);
    } else {
      httpServer = http.createServer(app);
    }

    const wsServer = new WebSocketServer({
      server: httpServer,
      path: "/",
    });

    const resolvers = getResolvers();
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const serverCleanup = useServer(
      {
        schema,
        // The `ctx` object contains the WebSocket connection context.
        // `ctx.connectionParams` holds the connection parameters (e.g., headers) sent by the client during the connection handshake.
        // This context is used to create a new GraphQL context for each WebSocket connection.
        context: async (ctx) => {
          // Here, `ctx.connectionParams` holds the connection parameters (e.g., headers)
          return createContext({ connection: ctx });
        },
      },
      wsServer,
    );

    const server = new ApolloServer<MyContext>({
      schema,
      introspection: true,
      status400ForVariableCoercionErrors: true,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
          async serverWillStart() {
            await Promise.resolve(); // Ensure async operation
            return {
              async drainServer() {
                await serverCleanup.dispose();
              },
            };
          },
        },
        isProduction
          ? ApolloServerPluginLandingPageProductionDefault({
              graphRef:
                process.env["APOLLO_GRAPH_REF"] ||
                "my-graph-id@my-graph-variant",
              footer: false,
            })
          : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
        createLoggingPlugin(logger),
      ],
    });

    await server.start();

    app.use(
      expressMiddleware(server, {
        context: async ({ req, connection }: ContextArgs) =>
          await createContext({ req, connection }),
      }),
    );

    return [app, httpServer];
  } catch (error) {
    // Exiting the process with a non-zero status code indicates that the server failed to start.
    // This is important for container orchestration systems (like Kubernetes) to detect the failure and take appropriate actions.
    console.error("Server startup error:", error);
    process.exit(1);
  }
};
