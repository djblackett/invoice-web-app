import "dotenv/config";
import { urlencoded } from "body-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { BaseException, InternalServerException } from "./exception.config";
import winston from "winston";

export const SECRET = process.env.SECRET || "";
export const PORT = Number(process.env.PORT) || 8000;
let DATABASE_URL = process.env.DATABASE_URL || "";

if (process.env.DEMO_MODE === "true") {
  DATABASE_URL = process.env.DEMO_DATABASE_URL || "";
  process.env.DATABASE_URL = DATABASE_URL;
}
export { DATABASE_URL };
export const CERT_DIR = process.env.CERT_DIR || "../certs";

export const NODE_ENV = process.env.NODE_ENV;

if (!SECRET) {
  throw new Error("Server env secret not set");
}

if (!PORT) {
  throw new Error("Server env port not set");
}

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

logger.info(`Database URL: ${DATABASE_URL}`);

export function serverConfig(app: Application) {
  app.use(
    "/",
    urlencoded({
      extended: true,
    }),
  );

  if (NODE_ENV === "production") {
    app.use(
      cors({
        origin: process.env.CORS_ORIGIN ?? "https://djblackett.github.io", // GitHub Pages URL
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
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
}

export function serverErrorConfig(app: Application) {
  app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err && err instanceof BaseException) {
      return res.status(err.statusCode).json(err);
    }

    if (err) {
      return res.status(500).json(new InternalServerException(err.message));
    }

    return next();
  });
}
