import "dotenv/config";
import { json, urlencoded } from "body-parser";
import express, { Application, NextFunction, Request, Response } from "express";
// import { BaseException, InternalServerException } from './exception.config';
// import passport from 'passport';
import { DatabaseConnection } from "../database/database.connection";
// import { AccessTokenStrategy, RefreshTokenStrategy } from '../auth/strategy';
import container from "./inversify.config";
import cors from "cors";
import { BaseException, InternalServerException } from "./exception.config";
import { expressMiddleware } from "@apollo/server/express4";

export const SECRET = process.env.SECRET
export const PORT = process.env.PORT || 8000;
export const NODE_ENV = process.env.NODE_ENV || "development";

export async function serverConfig(app: Application) {
  app.use(
    "/",
    urlencoded({
      extended: true,
    }),
  );
  app.use(cors());
  app.use(express.json());

  // app.use(passport.initialize());
  // const accessTokenStrategy = container.get(AccessTokenStrategy);
  // accessTokenStrategy.init();
  // const refreshTokenStrategy = container.get(RefreshTokenStrategy);
  // refreshTokenStrategy.init();

  const database = container.get(DatabaseConnection);
  await database.initConnection();
  // database.setAutoReconnect();
}

export function serverErrorConfig(app: Application) {
  // @ts-ignore
  app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err && err instanceof BaseException) {
      return res.status(err.statusCode).json(err);
    }

    if (err) {
      return res.status(500).json(new InternalServerException(err.message));
    }

    next();
  });
}
