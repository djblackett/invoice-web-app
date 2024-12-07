import "dotenv/config";
import { urlencoded } from "body-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { BaseException, InternalServerException } from "./exception.config";

export const SECRET = process.env.SECRET || "";
export const PORT = process.env.PORT || 8000;
export const NODE_ENV = process.env.NODE_ENV;
export const DATABASE_URL = process.env.DATABASE_URL || "";
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

console.error("NODE_ENV:", NODE_ENV);
console.error("DB_URL:", DB_URL);
console.error("DATABASE_URL", DATABASE_URL);

// if (!DB_URL) {
//   throw new Error("Server env db url not set");
// }

export const DB = {
  url: DATABASE_URL,
};

export function serverConfig(app: Application) {
  app.use(
    "/",
    urlencoded({
      extended: true,
    }),
  );
  // if (NODE_ENV === "development") {
  // app.use(
  //   cors({
  //     origin: "http://localhost:5173",
  //     methods: ["GET", "POST", "PUT", "DELETE"],
  //     // credentials: true,
  //   }),
  // );
  // } else {
  app.use(cors());
  // }
  app.options("*", cors()); // This will handle all OPTIONS requests

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
