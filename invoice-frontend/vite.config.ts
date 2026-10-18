/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from "node:path";
import * as fs from "node:fs";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const isDemoMode =
    (process.env.VITE_DEMO_MODE ?? env.VITE_DEMO_MODE) === "true";
  // Building static assets must never require local TLS keys.
  const useHttps =
    command === "serve" && !isDemoMode && process.env.DEV_HTTPS !== "false";
  return {
    plugins: [
      react(),
      tsconfigPaths(),
      visualizer({ filename: "bundle-visualization.html" }),
    ],
    base: "/invoice-web-app/",
    server: {
      host: "0.0.0.0",
      port: 5173,
      hmr: {
        host: "localhost",
        port: 5173,
      },
      https: useHttps
        ? {
            key: fs.readFileSync(
              path.resolve(__dirname, "./certs/localhost-key.pem"),
            ),
            cert: fs.readFileSync(
              path.resolve(__dirname, "./certs/localhost.pem"),
            ),
          }
        : undefined,
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      cssCodeSplit: true,
    },
  };
});
