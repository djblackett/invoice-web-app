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
import { CERT_DIR, MAX_REQUEST_BYTES, NODE_ENV } from "./config/server.config";
import { expressMiddleware } from "@apollo/server/express4";
import { connectionToken, createContext } from "./GraphQL/createContext";
import { singleDemoMutationPlugin } from "./GraphQL/singleDemoMutationPlugin";
import { isTemporaryDemoToken } from "./services/demoSessionPolicy";
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
        // eslint-disable-next-line security/detect-non-literal-fs-filename -- Certificate directory is operator configuration, never request input.
        key: fs.readFileSync(
          path.join(__dirname, CERT_DIR, "localhost-key.pem"),
          "ascii",
        ),
        // eslint-disable-next-line security/detect-non-literal-fs-filename -- Certificate directory is operator configuration, never request input.
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
      // Without this, `ws` accepts 100 MiB messages. Larger frames close the
      // socket (1009) before graphql-ws parses them or any context is built.
      maxPayload: MAX_REQUEST_BYTES,
    });

    const resolvers = getResolvers();
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const serverCleanup = useServer(
      {
        schema,
        // Temporary sessions need no WebSocket operation: the browser sends
        // only subscriptions here, and the only one (the administrator feed)
        // is closed to them. Their credentials are refused at connection_init
        // (4403), before any context or database work, so this transport
        // needs no second rate limit.
        onConnect: (ctx) =>
          !isTemporaryDemoToken(connectionToken(ctx.connectionParams) ?? ""),
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
        singleDemoMutationPlugin,
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
