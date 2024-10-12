import "dotenv/config";
import { urlencoded } from "body-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { BaseException, InternalServerException } from "./exception.config";

export const SECRET = process.env.SECRET || "";
export const PORT = process.env.PORT || 8000;
export const NODE_ENV = process.env.NODE_ENV;
let DB_URL: string;

if (!SECRET) {
  throw new Error("Server env secret not set");
}

if (!PORT) {
  throw new Error("Server env port not set");
}

if (NODE_ENV === "production") {
  DB_URL = process.env.DB_URL || "";
} else if (NODE_ENV === "test") {
  DB_URL = process.env.DB_URL_TEST || "";
} else {
  DB_URL = process.env.DB_URL_DEV || "";
}

console.log(NODE_ENV);

if (!DB_URL) {
  throw new Error("Server env db url not set");
}

export const DB = {
  url: DB_URL,
};

export function serverConfig(app: Application) {
  app.use(
    "/",
    urlencoded({
      extended: true,
    }),
  );
  app.use(cors());
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

    next();
    return;
  });
}
