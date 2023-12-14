
import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";
import invoicesRouter from "./src/routes/invoices";
import cors from "cors";
import myErrorHandler from "./src/routes/helpers/helpers";
import http from "http";
import typeDefs from "./src/GraphQL/typeDefs";
import resolvers from "./src/GraphQL/resolvers";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { createContext } from "./src/GraphQL/createContext";
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer";
import {makeExecutableSchema} from "@graphql-tools/schema";
import {ApolloServer} from "@apollo/server";

import { expressMiddleware} from "@apollo/server/express4";
import {ContextArgs, MyContext} from "./src/types";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault
} from '@apollo/server/plugin/landingPage/default';

import "dotenv/config"

process.env.NODE_ENV = "production";

console.log(process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  // await prisma.invoice.create({
  //   data: {
  //     id: "RT3080",
  //     createdAt: "2021-08-18",
  //     paymentDue: "2021-08-19",
  //     description: "Re-branding",
  //     paymentTerms: 1,
  //     clientName: "Jensen Huang",
  //     clientEmail: "jensenh@mail.com",
  //     status: "paid",
  //     senderAddress: {
  //       create: {
  //       street: "19 Union Terrace",
  //       city: "London",
  //       postCode: "E1 3EZ",
  //       country: "United Kingdom"
  //     },},
  //     clientAddress: {
  //       create: {
  //         street: "106 Kendell Street",
  //         city: "Sharrington",
  //         postCode: "NR24 5WQ",
  //         country: "United Kingdom"
  //       }
  //     },
  //     items: {
  //       create: [{
  //             id: "gbfhdsqg4783743bvh",
  //             name: "Brand Guidelines",
  //             quantity: 1,
  //             price: 1800.90,
  //             total: 1800.90
  //       }],
  //     },
  //     total: 1800.90
  //   },
  // });

  // const allInvoices = await prisma.invoice.findMany({
  //   include: {
  //     senderAddress: true,
  //     clientAddress: true,
  //     items: true
  //   }
  // });
  // console.log(allInvoices);
  // console.log(allInvoices[0].items);
}


main()
    // eslint-disable-next-line @typescript-eslint/require-await
    .then(async () => {
      console.log("Connected to Prisma");
      // await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });


// eslint-disable-next-line @typescript-eslint/require-await
const start = async () => {

  try {
    const app: Express = express();
    // app.use(express.json());
    // app.use(cors());

    const httpServer = http.createServer(app);
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: "/",
    });

    const schema = makeExecutableSchema({typeDefs, resolvers});
    const serverCleanup = useServer({schema}, wsServer);

    const server = new ApolloServer<MyContext>({
      schema,
      introspection: true,
      plugins: [
        ApolloServerPluginDrainHttpServer({httpServer}),
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

        process.env.NODE_ENV === 'production'
            ? ApolloServerPluginLandingPageProductionDefault({
              graphRef: 'my-graph-id@my-graph-variant',
              footer: false,
            }) : ApolloServerPluginLandingPageLocalDefault({footer: false}),],
    });

    await server.start();





    // @ts-ignore
    app.use(
        "/",
        cors(),
        express.json(),
        expressMiddleware(server, {
          // @ts-ignore
          // context: async ({req, connection }: ContextArgs) => await createContext({req, connection})
        })
    );

    const PORT = 8000;

    app.use(invoicesRouter, myErrorHandler);


    app.get("/api/ping", (_req, res) => {
      console.log("someone pinged here");
      res.send("pong");
    });

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.log("Server error:");``
    console.log(error);
  }
};

start();

export { prisma };

