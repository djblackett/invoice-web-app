import "dotenv/config";
import { urlencoded } from "body-parser";
import type { Application, NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import { createCorsOptions } from "./cors.config";
import { BaseException, InternalServerException } from "./exception.config";
import container from "./inversify.config";
import type { Logger } from "./logger.config";
import TYPES from "@/constants/identifiers";

const logger = container.get<Logger>(TYPES.Logger);

export const PORT = Number(process.env["PORT"]) || 8000;
export const DATABASE_URL = process.env["DATABASE_URL"] || "";
export const CERT_DIR = process.env["CERT_DIR"] ?? "../certs";
export const NODE_ENV = process.env["NODE_ENV"];
// One request-size bound for both GraphQL transports: express.json's default
// (100 KB) for HTTP, and the `ws` maxPayload for WebSocket frames.
export const MAX_REQUEST_BYTES = 100 * 1024;

if (!PORT) {
  logger.error("Server env port not set");
  throw new Error("Server env port not set");
}

logger.info(`Database configured: ${Boolean(DATABASE_URL)}`);
logger.info(`Server Port: ${PORT}`);
logger.info(`Node Environment: ${NODE_ENV}`);
logger.info(`Cert Directory: ${CERT_DIR}`);
logger.info(`Demo Mode: ${process.env["DEMO_MODE"]}`);

export function serverConfig(app: Application) {
  app.use(cors(createCorsOptions(NODE_ENV, process.env["CORS_ORIGIN"])));

  app.use(express.json({ limit: MAX_REQUEST_BYTES }));
  app.use((req, _, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
  });

  app.use(
    "/",
    urlencoded({
      extended: true,
    }),
  );
}

export function serverErrorConfig(app: Application) {
  app.use(
    (err: Error | null, _req: Request, res: Response, next: NextFunction) => {
      if (err instanceof BaseException) {
        logger.error(err.message);
        return res.status(err.statusCode).json(err);
      } else if (err) {
        logger.error(err.message);
        return res.status(500).json(new InternalServerException(err.message));
      }

      return next();
    },
  );
}
