// Keep runtime traffic pooled; only this migration subprocess uses the direct URL.
// Local/CI PostgreSQL needs only DATABASE_URL, without any Neon configuration.
require("dotenv/config");
const { spawnSync } = require("node:child_process");

const connection =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connection) throw new Error("Set DATABASE_URL before migrating.");
let url;
let runtimeUrl;
try {
  url = new URL(connection);
  runtimeUrl = new URL(process.env.DATABASE_URL || connection);
} catch {
  throw new Error("Invalid database connection URL.");
}
if (url.hostname.endsWith(".neon.tech")) {
  if (url.hostname.includes("-pooler.")) {
    throw new Error(
      "Set DATABASE_URL_UNPOOLED to the direct Neon connection for migrations.",
    );
  }
  if (
    !["require", "verify-ca", "verify-full"].includes(
      url.searchParams.get("sslmode"),
    )
  ) {
    throw new Error(
      "Neon migrations require TLS (sslmode=require or stronger).",
    );
  }
}
if (
  [url, runtimeUrl].some((value) => value.hostname.endsWith(".neon.tech")) &&
  (url.hostname !== runtimeUrl.hostname.replace("-pooler.", ".") ||
    url.pathname !== runtimeUrl.pathname)
) {
  throw new Error(
    "Neon migration and application URLs must target the same database endpoint.",
  );
}
const result = spawnSync(
  process.execPath,
  ["node_modules/prisma/build/index.js", "migrate", "deploy"],
  { env: { ...process.env, DATABASE_URL: connection }, stdio: "inherit" },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
