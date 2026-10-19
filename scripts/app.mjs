import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));

// Shell variables win, followed by Neon's root files, then package dotenv files.
// Database URLs stay out of the browser bundle; Vite exposes VITE_* variables only.
for (const name of [".env.local", ".env"]) {
  const file = path.join(root, name);
  if (existsSync(file)) loadEnvFile(file);
}

process.env.VITE_BACKEND_URL ??= `http://localhost:${process.env.PORT || 8000}`;

function run(packageName, script, overrides = {}) {
  const result = spawnSync("npm", ["--prefix", packageName, "run", script], {
    cwd: root,
    env: { ...process.env, ...overrides },
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const task = process.argv[2];
if (task === "build") {
  run("invoice-backend", "prisma-generate");
  run("invoice-backend", "build");
  run("invoice-frontend", "build");
} else if (task === "migrate") {
  run("invoice-backend", "migrate:deploy");
} else if (task === "seed") {
  const result = spawnSync(process.execPath, ["prisma/seed.mjs"], {
    cwd: path.join(root, "invoice-backend"),
    env: process.env,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} else if (task === "start" || task === "backend") {
  const children = [];
  let stopping = false;
  function stop(code) {
    if (stopping) return;
    stopping = true;
    process.exitCode = code;
    for (const child of children) child.kill("SIGTERM");
  }
  function launch(directory, args, overrides = {}) {
    const child = spawn(process.execPath, args, {
      cwd: path.join(root, directory),
      env: { ...process.env, ...overrides },
      stdio: "inherit",
    });
    children.push(child);
    child.on("error", (error) => {
      console.error(error.message);
      stop(1);
    });
    child.on("exit", (code) => stop(code ?? 1));
  }
  process.on("SIGINT", () => stop(0));
  process.on("SIGTERM", () => stop(0));
  launch("invoice-backend", ["dist/src/index.js"], { NODE_ENV: "production" });
  if (task === "start") {
    launch("invoice-frontend", [
      "node_modules/vite/bin/vite.js",
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      "5173",
      "--strictPort",
    ]);
  }
} else {
  throw new Error(`Unknown app command: ${task}`);
}
