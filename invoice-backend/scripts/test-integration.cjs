// Require an explicit disposable target before dotenv/application modules load.
const { spawnSync } = require("node:child_process");
if (!process.env.DATABASE_URL) {
  throw new Error(
    "Set DATABASE_URL to a disposable PostgreSQL database before integration tests.",
  );
}
const env = {
  ...process.env,
  NODE_ENV: "test",
  DEMO_MODE: "false",
  CERT_DIR: "", // Test HTTP transport needs no developer TLS keys.
};
for (const args of [
  ["node_modules/prisma/build/index.js", "migrate", "deploy"],
  [
    "node_modules/vitest/vitest.mjs",
    "run",
    process.argv.includes("--coverage") ? "tests" : "tests/integration",
    "--reporter=default",
    "--no-file-parallelism",
    "--hookTimeout=60000",
    ...process.argv.slice(2),
  ],
]) {
  const result = spawnSync(process.execPath, args, { env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
