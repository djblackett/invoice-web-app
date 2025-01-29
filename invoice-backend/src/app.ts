import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import container from "./config/inversify.config";
import {
  NODE_ENV,
  serverConfig,
  serverErrorConfig,
} from "./config/server.config";
import "./controllers/invoice.controller";
import { Request, Response } from "express";
import { DatabaseConnection } from "./database/prisma.database.connection";
import rateLimit from "express-rate-limit";
import express from "express";

export const createApp = async () => {
  try {
    const app = express();
    serverConfig(app);
    serverErrorConfig(app);

    const database = container.get(DatabaseConnection);
    await database.initConnection();
    app.get("/health", (_req: Request, res: Response) => {
      res.status(200).send("OK");
    });

    // Rate limiter so I don't get spammed in prod
    if (NODE_ENV === "production") {
      const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      });

      app.use(limiter);
    }

    return app;
  } catch (error) {
    console.error("Error during app initialization:", error);
    throw error; // Rethrow the error to handle it in the caller
  }
};
