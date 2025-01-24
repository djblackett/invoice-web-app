/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import fs from "fs";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
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
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "./certs/localhost-key.pem"),
      ),
      cert: fs.readFileSync(path.resolve(__dirname, "./certs/localhost.pem")),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: true,
  },
});
