import http from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServer } from "@apollo/server";
import { ContextArgs, MyContext } from "./constants/types";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { createApp } from "./app";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./GraphQL/typeDefs";
import container from "./config/inversify.config";
import { CERT_DIR, NODE_ENV } from "./config/server.config";
import { expressMiddleware } from "@apollo/server/express4";
import { createContext } from "./GraphQL/createContext";
import path from "path";
import fs from "fs";
import https from "https";
import { getResolvers } from "./resolvers";
import { UserService } from "./services/user.service";

export const createServer = async () => {
  try {
    const app = await createApp();
    let httpServer;
    if (CERT_DIR && NODE_ENV !== "production") {
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

    const userService = container.get(UserService);
    const resolvers = getResolvers(userService);
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer<MyContext>({
      schema,
      introspection: true,
      status400ForVariableCoercionErrors: true,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
          async serverWillStart() {
            return {
              async drainServer() {
                await serverCleanup.dispose();
              },
            };
          },
        },
        NODE_ENV === "production"
          ? ApolloServerPluginLandingPageProductionDefault({
              graphRef: "my-graph-id@my-graph-variant",
              footer: false,
            })
          : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
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
    console.error("Server startup error:", error);
    process.exit(1);
  }
};
