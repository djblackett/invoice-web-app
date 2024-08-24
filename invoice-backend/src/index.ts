import "reflect-metadata";
import http from "http";
import typeDefs from "./GraphQL/typeDefs";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "@apollo/server";
import { ContextArgs, MyContext } from "./constants/types";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { InversifyExpressServer } from "inversify-express-utils";
import container from "./config/inversify.config";
import { NODE_ENV, PORT, serverConfig, serverErrorConfig } from "./config/server.config";

import { expressMiddleware } from "@apollo/server/express4";
import { createContext } from "./GraphQL/createContext";
import "./controllers/invoice.controller";
import InvoiceController from "./controllers/invoice.controller";
import { Request, Response } from 'express';
// process.env.NODE_ENV = "production";

const start = async () => {
  try {
    const inversifyServer = new InversifyExpressServer(container);
    inversifyServer.setConfig(serverConfig);
    inversifyServer.setErrorConfig(serverErrorConfig);

    const app = inversifyServer.build();

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

        // Install a landing page plugin based on NODE_ENV
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


    app.get("/api/ping", (_req: Request, res: Response) => {
      console.log("someone pinged here");
      res.send("pong");
    });

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    console.log("Server error:");
  }
};

start();
