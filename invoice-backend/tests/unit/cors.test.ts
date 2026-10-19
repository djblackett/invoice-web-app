import cors from "cors";
import express from "express";
import type { Server } from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import { createCorsOptions } from "../../src/config/cors.config";

let server: Server | undefined;

afterEach(async () => {
  if (server) {
    const listener = server;
    server = undefined;
    listener.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      listener.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

async function request(
  nodeEnv: string | undefined,
  configuredOrigin: string | undefined,
  origin: string | undefined,
  method = "GET",
) {
  const app = express();
  app.use(cors(createCorsOptions(nodeEnv, configuredOrigin)));
  app.all("/probe", (_req, res) => res.json({ ok: true }));
  const listener = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve, reject) => {
    listener.once("listening", resolve);
    listener.once("error", reject);
  });
  server = listener;
  const address = listener.address();
  if (!address || typeof address === "string") throw new Error("No HTTP port");
  const headers: Record<string, string> = {};
  if (origin !== undefined) headers["Origin"] = origin;
  if (method === "OPTIONS") {
    headers["Access-Control-Request-Method"] = "POST";
    headers["Access-Control-Request-Headers"] = "authorization,content-type";
  }
  return fetch(`http://127.0.0.1:${address.port}/probe`, { method, headers });
}

function expectAuthorized(response: Response, origin: string) {
  expect(response.headers.get("access-control-allow-origin")).toBe(origin);
  expect(response.headers.get("access-control-allow-credentials")).toBe("true");
  expect(response.headers.get("vary")).toContain("Origin");
}

function expectNoCors(response: Response) {
  expect(
    [...response.headers.keys()].filter((name) =>
      name.startsWith("access-control-"),
    ),
  ).toEqual([]);
}

describe.each(["GET", "OPTIONS"])("HTTP CORS policy: %s", (method) => {
  it.each(["http://localhost:5173", "https://localhost:5173"])(
    "allows documented development origin %s",
    async (origin) => {
      const response = await request("development", undefined, origin, method);
      expectAuthorized(response, origin);
      if (method === "OPTIONS") {
        expect(response.status).toBe(204);
        expect(response.headers.get("access-control-allow-methods")).toContain(
          "POST",
        );
        expect(response.headers.get("access-control-allow-headers")).toBe(
          "authorization,content-type",
        );
      } else {
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ ok: true });
      }
    },
  );

  it.each([
    "https://attacker.example",
    "null",
    "http://localhost:5174",
    "http://localhost:5173.attacker.example",
    "https://sub.localhost:5173",
    "http://127.0.0.1:5173",
  ])("withholds all CORS headers from %s", async (origin) => {
    expectNoCors(await request("development", undefined, origin, method));
  });

  it.each([undefined, "test", "CI", "development", "production"])(
    "allows only the configured dynamic E2E origin in %s",
    async (nodeEnv) => {
      const origin = "http://127.0.0.1:49153";
      const response = await request(nodeEnv, origin, origin, method);
      expectAuthorized(response, origin);
      if (method === "OPTIONS") expect(response.status).toBe(204);
    },
  );

  it.each(["development", "production"])(
    "configured origin replaces defaults in %s",
    async (nodeEnv) => {
      expectNoCors(
        await request(
          nodeEnv,
          "https://app.example",
          nodeEnv === "production"
            ? "https://djblackett.github.io"
            : "http://localhost:5173",
          method,
        ),
      );
    },
  );

  it.each(["null", "https://app.example.attacker.example"])(
    "production configured policy denies %s",
    async (origin) => {
      expectNoCors(
        await request("production", "https://app.example", origin, method),
      );
    },
  );

  it("preserves the production default and explicit methods", async () => {
    const origin = "https://djblackett.github.io";
    const response = await request("production", undefined, origin, method);
    expectAuthorized(response, origin);
    if (method === "OPTIONS") {
      expect(response.headers.get("access-control-allow-methods")).toBe(
        "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      );
    }
  });

  it("denies local origins with the production default", async () => {
    expectNoCors(
      await request("production", undefined, "http://localhost:5173", method),
    );
  });

  it("lets requests without Origin reach the route without CORS headers", async () => {
    const response = await request("production", undefined, undefined, method);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expectNoCors(response);
  });
});

describe.each(["development", "production"])(
  "invalid CORS_ORIGIN in %s",
  (nodeEnv) => {
    it.each([
      "",
      "*",
      "null",
      "https://*.example.com",
      "https://app.example,http://localhost:5173",
      "app.example",
      "ftp://app.example",
      "https://app.example/",
      "https://app.example/path",
      "https://app.example?query=1",
      "https://app.example#fragment",
      "https://user:password@app.example",
    ])("rejects %j before serving requests", (origin) => {
      expect(() => createCorsOptions(nodeEnv, origin)).toThrow(
        "CORS_ORIGIN must be one exact HTTP(S) origin",
      );
    });
  },
);
