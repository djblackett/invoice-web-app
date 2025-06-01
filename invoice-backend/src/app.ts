import "reflect-metadata";
import container from "./config/inversify.config";
import {
  DATABASE_URL,
  NODE_ENV,
  serverConfig,
  serverErrorConfig,
} from "./config/server.config";
import type { Request, Response } from "express";
import { DatabaseConnection } from "./database/prisma.database.connection";
import rateLimit from "express-rate-limit";
import express from "express";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
import TYPES from "./constants/identifiers";
import type { Logger } from "./config/logger.config";
import passport from "./config/passport.config";
import type { UserIdAndRole } from "./constants/types";

const logger = container.get<Logger>(TYPES.Logger);

export const createApp = async () => {
  try {
    const app = express();
    serverConfig(app);
    serverErrorConfig(app);

    const database = container.get(DatabaseConnection);
    await database.initConnection();

    app.set("trust proxy", 1);

    // Session configuration
    app.use(
      session({
        secret: process.env["SESSION_SECRET"] || "fallback-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
      }),
    );

    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Google OAuth routes
    app.get(
      "/auth/google",
      passport.authenticate("google", {
        scope: ["profile", "email"],
      }) as express.RequestHandler,
    );

    app.get(
      "/auth/google/callback",
      passport.authenticate("google", {
        failureRedirect: "/login",
      }) as express.RequestHandler,
      (req: Request, res: Response) => {
        // Successful authentication
        const user = req.user as UserIdAndRole;
        // In a real app, you might want to generate a JWT token here
        // and redirect to the frontend with the token
        res.redirect(
          `${process.env["FRONTEND_URL"] || "http://localhost:3000"}/auth/success?user=${encodeURIComponent(JSON.stringify(user))}`,
        );
      },
    );

    app.get("/auth/logout", (req: Request, res: Response) => {
      req.logout((err) => {
        if (err) {
          logger.error("Logout error: " + JSON.stringify(err));
          return res.status(500).send("Logout failed");
        }
        res.redirect("/");
      });
    });

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
