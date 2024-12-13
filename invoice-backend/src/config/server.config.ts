import "dotenv/config";
import { urlencoded } from "body-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { BaseException, InternalServerException } from "./exception.config";

export const SECRET = process.env.SECRET || "";
export const PORT = Number(process.env.PORT) || 8000;
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

  console.log(NODE_ENV);

  // if (NODE_ENV === "development") {
  //   app.use(
  //     cors({
  //       origin: "http://localhost:*",
  //       methods: ["GET", "HEAD", "PATCH", "POST", "PUT", "DELETE"],
  //       // credentials: true,
  //     }),
  //   );
  app.options("*", cors()); // This will handle all OPTIONS requests
  if (NODE_ENV === "production") {
    app.use(
      cors({
        origin: "https://djblackett.github.io", // GitHub Pages URL
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
      }),
    );
  } else {
    app.use(cors());
  }

  // app.options("*", cors()); // This will handle all OPTIONS requests

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
