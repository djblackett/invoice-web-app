import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import container from "./config/inversify.config";
import { serverConfig, serverErrorConfig } from "./config/server.config";
import "./controllers/invoice.controller";
import { Request, Response } from "express";
import { DatabaseConnection } from "./database/prisma.database.connection";

export const createApp = async () => {
  try {
    const inversifyServer = new InversifyExpressServer(container);
    inversifyServer.setConfig(serverConfig);
    inversifyServer.setErrorConfig(serverErrorConfig);

    const database = container.get(DatabaseConnection);
    await database.initConnection();

    const app = inversifyServer.build();

    // Additional setup like middlewares or routes
    app.get("/api/ping", (_req: Request, res: Response) => {
      console.log("someone pinged here");
      res.send("pong");
    });

    return app;
  } catch (error) {
    console.error("Error during app initialization:", error);
    throw error; // Rethrow the error to handle it in the caller
  }
};
