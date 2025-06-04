import "dotenv/config";
import { urlencoded } from "body-parser";
import type { Application, NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import { BaseException, InternalServerException } from "./exception.config";
export const PORT = Number(process.env["PORT"]) || 8000;
let DATABASE_URL = process.env["DATABASE_URL"] || "";
export const USE_SQLITE = process.env["USE_SQLITE"] === "true";
export const USE_IN_MEMORY = process.env["USE_IN_MEMORY"] === "true";

if (USE_IN_MEMORY) {
  DATABASE_URL = "file::memory:?cache=shared";
  process.env["DATABASE_URL"] = DATABASE_URL;
} else if (USE_SQLITE && !DATABASE_URL.startsWith("file:")) {
  DATABASE_URL = "file:./dev.db";
  process.env["DATABASE_URL"] = DATABASE_URL;
} else if (process.env["DEMO_MODE"] === "true") {
  DATABASE_URL = process.env["DEMO_DATABASE_URL"] || "";
  process.env["DATABASE_URL"] = DATABASE_URL;
}
export { DATABASE_URL };
export const CERT_DIR = process.env["CERT_DIR"] || "../certs";
export const NODE_ENV = process.env["NODE_ENV"];

if (!PORT) {
  throw new Error("Server env port not set");
}

// Logging will be handled in the main application after container initialization
console.log(`Database URL: ${DATABASE_URL}`);
console.log(`Server Port: ${PORT}`);
console.log(`Node Environment: ${NODE_ENV}`);
console.log(`Cert Directory: ${CERT_DIR}`);
console.log(`Demo Mode: ${process.env["DEMO_MODE"]}`);
console.log(`Use SQLite: ${USE_SQLITE}`);
console.log(`Use In-Memory: ${USE_IN_MEMORY}`);

export function serverConfig(app: Application) {
  if (NODE_ENV === "production") {
    app.use(
      cors({
        origin: process.env["CORS_ORIGIN"] ?? "https://djblackett.github.io", // GitHub Pages URL as default
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
      }),
    );
  } else {
    app.use(
      cors({
        origin: process.env["CORS_ORIGIN"] ?? "*",
        credentials: true,
      }),
    );
  }

  app.use(express.json());
  app.use((req, _, next) => {
    // console.log(`Incoming request: ${req.method} ${req.url}`);
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
        console.error(err.message);
        return res.status(err.statusCode).json(err);
      } else if (err) {
        console.error(err.message);
        return res.status(500).json(new InternalServerException(err.message));
      }

      return next();
    },
  );
}
