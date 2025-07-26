import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [react()],

  // Use relative paths for local preview, change if deploying to a subdirectory
  base: "./",

  // Build output directory (defaults to 'dist', you can omit this if using 'dist')
  build: {
    outDir: "dist",
  },

  // Server configuration for local development
  server: {
    host: "0.0.0.0", // Allow external access to the dev server
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
