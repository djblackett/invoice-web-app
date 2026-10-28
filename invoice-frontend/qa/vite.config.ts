import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Ignore developer .env files and keep Vite's writable cache with this run's logs.
export default defineConfig({
  base: "/invoice-web-app/",
  envDir: process.env.E2E_ARTIFACTS,
  cacheDir: `${process.env.E2E_ARTIFACTS}/vite-${process.env.VITE_DEMO_MODE}-${process.env.VITE_DEMO_SESSIONS || "off"}`,
  plugins: [react(), tsconfigPaths()],
  server: { hmr: false },
});
