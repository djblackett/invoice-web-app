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
import InvoiceController from "./controllers/invoice.controller";
import container from "./config/inversify.config";
import { NODE_ENV } from "./config/server.config";
import { expressMiddleware } from "@apollo/server/express4";
import { createContext } from "./GraphQL/createContext";

export const createServer = async () => {
  try {
    const app = await createApp();
    const httpServer = http.createServer(app);
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: "/",
    });

    const controller = container.get(InvoiceController);
    const resolvers = controller.resolvers;
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
