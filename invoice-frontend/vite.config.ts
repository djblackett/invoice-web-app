/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import fs from "fs";
import { visualizer } from "rollup-plugin-visualizer";

const isDemoMode = process.env.VITE_DEMO_MODE === "true";
const ReactCompilerConfig = {
  target: "19", //"18", // '17' | '18' |
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
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
    https: !isDemoMode
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
});
