import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import net from "node:net";

const frontend = fileURLToPath(new URL("../../", import.meta.url));
const backend = path.resolve(frontend, "../invoice-backend");
const artifacts = await mkdtemp(path.join(tmpdir(), "invoice-e2e-"));
const pgBin = process.env.PG_BIN || ""; // e.g. /usr/lib/postgresql/16/bin
const pg = (name) => path.join(pgBin, name);
const children = [];
let clusterStarted = false;
let cleaning = false;
const env = {
  ...process.env,
  NODE_ENV: "production",
  DEMO_MODE: "true",
  DOMAIN: "",
  AUDIENCE: "",
  SECRET: "local-e2e-only",
  VITE_DOMAIN: "",
  VITE_CLIENT_ID: "",
  VITE_AUDIENCE: "",
  VITE_SCOPE: "",
  VITE_REDIRECT_URI: "",
  VITE_DEMO_MODE: "true",
  E2E_ARTIFACTS: artifacts,
  DOTENV_CONFIG_PATH: path.join(artifacts, "absent.env"),
};

function launch(command, args, cwd, overrides = {}, logName = "setup") {
  const log = createWriteStream(path.join(artifacts, `${logName}.log`), {
    flags: "a",
  });
  const child = spawn(command, args, {
    cwd,
    env: { ...env, ...overrides },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.pipe(log);
  if (logName === "playwright") child.stdout.pipe(process.stdout);
  child.stderr.pipe(log);
  child.on("error", (error) => log.write(`${error.message}\n`));
  child.on("close", () => log.end());
  children.push(child);
  return child;
}
async function run(command, args, cwd, overrides, logName) {
  const child = launch(command, args, cwd, overrides, logName);
  const [code] = await once(child, "exit");
  if (code !== 0)
    throw new Error(
      `${command} ${args.join(" ")} failed (${code}); see ${artifacts}`,
    );
}
async function freePort() {
  const server = net.createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}
async function ready(url, child) {
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null)
      throw new Error(`Service exited before readiness: ${url}`);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1000) });
      if (response.ok) return;
    } catch {
      /* service is still starting */
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Service readiness timeout: ${url}`);
}
async function cleanup() {
  if (cleaning) return;
  cleaning = true;
  for (const child of children.reverse()) {
    if (child.exitCode !== null || child.signalCode !== null) continue;
    child.kill("SIGTERM");
    await Promise.race([
      once(child, "exit"),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);
    if (child.exitCode === null) child.kill("SIGKILL");
  }
  if (clusterStarted) {
    // pg_ctl's daemon is independent of its launcher.
    const stop = spawn(
      pg("pg_ctl"),
      ["-D", path.join(artifacts, "pgdata"), "stop", "-m", "immediate"],
      { stdio: "ignore" },
    );
    await once(stop, "exit");
  }
  await rm(path.join(artifacts, "pgdata"), { recursive: true, force: true });
  await rm(path.join(artifacts, "pgsocket"), { recursive: true, force: true });
}
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, async () => {
    await cleanup();
    process.exit(130);
  });
}

console.log(`Isolated E2E logs, traces and report: ${artifacts}`);
try {
  // Never accept an existing DATABASE_URL, server URL or Auth0 credentials.
  const dbPort = await freePort();
  await mkdir(path.join(artifacts, "pgsocket"));
  await run(
    pg("initdb"),
    [
      "-D",
      path.join(artifacts, "pgdata"),
      "-U",
      "postgres",
      "--auth=trust",
      "--no-locale",
      "--encoding=UTF8",
    ],
    frontend,
  );
  await run(
    pg("pg_ctl"),
    [
      "-D",
      path.join(artifacts, "pgdata"),
      "-l",
      path.join(artifacts, "postgres.log"),
      "-o",
      `-p ${dbPort} -k ${artifacts}/pgsocket -h 127.0.0.1`,
      "-w",
      "start",
    ],
    frontend,
  );
  clusterStarted = true;
  await run(
    pg("createdb"),
    ["-h", "127.0.0.1", "-p", String(dbPort), "-U", "postgres", "browser_e2e"],
    frontend,
  );
  env.DATABASE_URL = `postgresql://postgres@127.0.0.1:${dbPort}/browser_e2e`;
  await run(
    process.execPath,
    ["node_modules/prisma/build/index.js", "generate"],
    backend,
  );
  await run(
    process.execPath,
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    backend,
  );
  await run(process.execPath, ["prisma/seed.mjs"], backend);
  await run("npm", ["run", "build"], backend);

  if (process.env.E2E_BACKEND_REGRESSION === "true") {
    await run(
      pg("createdb"),
      [
        "-h",
        "127.0.0.1",
        "-p",
        String(dbPort),
        "-U",
        "postgres",
        "backend_regression",
      ],
      frontend,
    );
    const regressionEnv = {
      DATABASE_URL: `postgresql://postgres@127.0.0.1:${dbPort}/backend_regression`,
      NODE_ENV: "test",
      DEMO_MODE: "false",
      CERT_DIR: "",
    };
    await run(
      "npm",
      ["run", "test:unit"],
      backend,
      regressionEnv,
      "backend-unit",
    );
    await run(
      "npm",
      ["run", "test:integration"],
      backend,
      regressionEnv,
      "backend-integration",
    );
  }

  for (const enabled of [true, false]) {
    const apiPort = await freePort();
    const uiPort = await freePort();
    const apiURL = `http://127.0.0.1:${apiPort}`;
    const uiURL = `http://127.0.0.1:${uiPort}`;
    const label = enabled ? "demo" : "disabled";
    const api = launch(
      process.execPath,
      ["dist/src/index.js"],
      backend,
      {
        DEMO_MODE: String(enabled),
        PORT: String(apiPort),
        CORS_ORIGIN: uiURL,
      },
      `backend-${label}`,
    );
    await ready(`${apiURL}/health`, api);
    const uiEnv = {
      NODE_ENV: "production",
      VITE_DEMO_MODE: String(enabled),
      VITE_BACKEND_URL: apiURL,
    };
    const uiDist = path.join(artifacts, `dist-${label}`);
    await run(
      process.execPath,
      [
        "node_modules/vite/bin/vite.js",
        "build",
        "--config",
        "qa/vite.config.ts",
        "--outDir",
        uiDist,
      ],
      frontend,
      uiEnv,
      `frontend-build-${label}`,
    );
    const ui = launch(
      process.execPath,
      [
        "node_modules/vite/bin/vite.js",
        "preview",
        "--config",
        "qa/vite.config.ts",
        "--outDir",
        uiDist,
        "--host",
        "127.0.0.1",
        "--port",
        String(uiPort),
        "--strictPort",
      ],
      frontend,
      uiEnv,
      `frontend-${label}`,
    );
    await ready(`${uiURL}/invoice-web-app/`, ui);
    env[enabled ? "E2E_BASE_URL" : "E2E_DISABLED_URL"] =
      `${uiURL}/invoice-web-app/`;
    env[enabled ? "E2E_API_URL" : "E2E_DISABLED_API_URL"] = apiURL;
  }
  const args = process.argv.slice(2);
  await run(
    process.execPath,
    ["node_modules/@playwright/test/cli.js", "test", ...args],
    frontend,
    {},
    "playwright",
  );
  console.log(
    `Playwright passed. Report: ${artifacts}/playwright-report/index.html`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await cleanup();
}
