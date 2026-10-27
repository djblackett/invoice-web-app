import type { Request, Response } from "express";
import type { PrismaClient } from "@prisma/client";
import {
  allocateDemoSession,
  DemoSessionError,
} from "../services/demoSession.service";
import { demoSessionsEnabled } from "../services/demoSessionPolicy";

export const demoSessionHandler =
  (prisma: PrismaClient) => async (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-store");
    if (!demoSessionsEnabled()) {
      res.status(404).json({ code: "DEMO_SESSIONS_DISABLED" });
      return;
    }
    // No identity, role, lifetime or profile input accepted, including in query params.
    if (
      !req.is("application/json") ||
      !req.body ||
      Array.isArray(req.body) ||
      typeof req.body !== "object" ||
      Object.keys(req.body as object).length !== 0 ||
      Object.keys(req.query).length !== 0
    ) {
      res.status(400).json({ code: "EMPTY_JSON_OBJECT_REQUIRED" });
      return;
    }
    try {
      res.status(201).json(await allocateDemoSession(prisma));
    } catch (error) {
      if (error instanceof DemoSessionError) {
        res
          .status(
            error.code === "DISABLED"
              ? 404
              : error.code === "CAPACITY"
                ? 503
                : 429,
          )
          .json({ code: `DEMO_SESSIONS_${error.code}` });
        return;
      }
      // Do not log credentials, Prisma arguments, or the allocation response.
      res.status(503).json({ code: "DEMO_SESSIONS_UNAVAILABLE" });
    }
  };
