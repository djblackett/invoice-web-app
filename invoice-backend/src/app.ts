import "reflect-metadata";
import container from "./config/inversify.config";
import {
  DATABASE_URL,
  NODE_ENV,
  serverConfig,
  serverErrorConfig,
} from "./config/server.config";
import type { Request, Response } from "express";
import type { IDatabaseConnection } from "./database/database.connection";
import rateLimit from "express-rate-limit";
import express from "express";
import { PrismaClient } from "@prisma/client";
import TYPES from "./constants/identifiers";
import type { Logger } from "./config/logger.config";

const logger = container.get<Logger>(TYPES.Logger);

export const createApp = async () => {
  try {
    const app = express();
    serverConfig(app);
    serverErrorConfig(app);

    const database = container.get<IDatabaseConnection>(TYPES.DatabaseConnection);
    await database.initConnection();

    app.set("trust proxy", 1);

    app.get("/health", (_req: Request, res: Response) => {
      res.status(200).send("OK");
    });

    app.get("/test-setup", (_req: Request, res: Response) => {
      if (
        NODE_ENV === "test" ||
        NODE_ENV === "CI" ||
        NODE_ENV === "development"
      ) {
        const childContainer = container.createChild();
        const prisma = new PrismaClient({ datasourceUrl: DATABASE_URL });
        childContainer.bind<PrismaClient>(PrismaClient).toConstantValue(prisma);
        prisma.invoice
          .deleteMany()
          .then((result) => {
            logger.info("Deleted invoices:" + JSON.stringify(result));
            childContainer.unbind(PrismaClient);
            res.status(200).send("OK");
          })
          .catch((error) => {
            logger.error("Error deleting invoices: " + JSON.stringify(error));
            res.status(500).send("Internal Server Error");
          });
        return;
      }
      logger.warn("Forbidden request to /test-setup");
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
    logger.error("Error during app initialization: " + JSON.stringify(error));
    throw error; // Rethrow the error to handle it in the caller
  }
};
