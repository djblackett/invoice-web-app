/// <reference types="vitest" />
import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: "/invoice-web-app/",
  // base: "/",
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setupTests.ts",
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    hmr: {
      host: "localhost",
      port: 5173,
    },
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "./certs/localhost-key.pem"),
      ),
      cert: fs.readFileSync(path.resolve(__dirname, "./certs/localhost.pem")),
    },
  },
});
