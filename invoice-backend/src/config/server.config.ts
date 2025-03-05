import "dotenv/config";
import { urlencoded } from "body-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { BaseException, InternalServerException } from "./exception.config";
import container from "./inversify.config";
import { Logger } from "./logger.config";
import TYPES from "@/constants/identifiers";

const logger = container.get<Logger>(TYPES.Logger);

export const PORT = Number(process.env.PORT) || 8000;
let DATABASE_URL = process.env.DATABASE_URL || "";

if (process.env.DEMO_MODE === "true") {
  DATABASE_URL = process.env.DEMO_DATABASE_URL || "";
  process.env.DATABASE_URL = DATABASE_URL;
}
export { DATABASE_URL };
export const CERT_DIR = process.env.CERT_DIR || "../certs";
export const NODE_ENV = process.env.NODE_ENV;

if (!PORT) {
  logger.error("Server env port not set");
  throw new Error("Server env port not set");
}

logger.info(`Database URL: ${DATABASE_URL}`);
logger.info(`Server Port: ${PORT}`);
logger.info(`Node Environment: ${NODE_ENV}`);
logger.info(`Cert Directory: ${CERT_DIR}`);
logger.info(`Demo Mode: ${process.env.DEMO_MODE}`);

export function serverConfig(app: Application) {
  if (NODE_ENV === "production") {
    app.use(
      cors({
        origin: process.env.CORS_ORIGIN ?? "https://djblackett.github.io", // GitHub Pages URL as default
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
      }),
    );
  } else {
    app.use(
      cors({
        origin: process.env.CORS_ORIGIN ?? "*",
        credentials: true,
      }),
    );
  }

  app.use(express.json());
  app.use((req, res, next) => {
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
  app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err && err instanceof BaseException) {
      logger.error(err.message);
      return res.status(err.statusCode).json(err);
    }

    if (err) {
      logger.error(err.message);
      return res.status(500).json(new InternalServerException(err.message));
    }

    return next();
  });
}
