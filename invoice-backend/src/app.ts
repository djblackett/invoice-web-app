import "reflect-metadata";
import container from "./config/inversify.config";
import {
  DATABASE_URL,
  NODE_ENV,
  serverConfig,
  serverErrorConfig,
} from "./config/server.config";
import { Request, Response } from "express";
import { DatabaseConnection } from "./database/prisma.database.connection";
import rateLimit from "express-rate-limit";
import express from "express";
import { PrismaClient } from "@prisma/client";

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

    app.get("/test-setup", async (_req: Request, res: Response) => {
      if (
        NODE_ENV === "test" ||
        NODE_ENV === "CI" ||
        NODE_ENV === "development"
      ) {
        const childContainer = container.createChild();
        const prisma = new PrismaClient({ datasourceUrl: DATABASE_URL });
        childContainer.bind<PrismaClient>(PrismaClient).toConstantValue(prisma);
        await prisma.invoice.deleteMany({});
        childContainer.unbind(PrismaClient);
        res.status(200).send("OK");
        return;
      }
      res.status(403).send("Forbidden");
    });

    // Rate limiter to prevent abuse and limit the number of requests per IP address in production
    // Configuration: 100 requests per 15 minutes window, standard headers enabled, legacy headers disabled
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
