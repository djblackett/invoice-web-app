import type { CorsOptions } from "cors";

// Vite's documented HTTP/demo and HTTPS development URLs, on its fixed port.
const developmentOrigins = ["http://localhost:5173", "https://localhost:5173"];

export function createCorsOptions(
  nodeEnv: string | undefined,
  configuredOrigin: string | undefined,
): CorsOptions {
  let allowedOrigins: string[];
  if (configuredOrigin !== undefined) {
    const message =
      "CORS_ORIGIN must be one exact HTTP(S) origin, without a path, wildcard or comma-separated list";
    let url: URL;
    try {
      url = new URL(configuredOrigin);
    } catch {
      throw new Error(message);
    }
    if (
      !["http:", "https:"].includes(url.protocol) ||
      configuredOrigin !== url.origin ||
      configuredOrigin.includes("*") ||
      configuredOrigin.includes(",")
    ) {
      throw new Error(message);
    }
    allowedOrigins = [configuredOrigin];
  } else {
    allowedOrigins =
      nodeEnv === "production"
        ? ["https://djblackett.github.io"]
        : developmentOrigins;
  }

  return {
    origin(origin, callback) {
      // Return an allowlisted value, never an unchecked request origin. False
      // skips all CORS headers, including credentials, for absent/denied origins.
      callback(
        null,
        allowedOrigins.find((allowed) => allowed === origin) ?? false,
      );
    },
    credentials: true,
    ...(nodeEnv === "production"
      ? { methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS" }
      : {}),
  };
}
