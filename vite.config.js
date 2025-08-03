import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "_site/assets",
    emptyOutDir: false,
    rollupOptions: {
      input: "./src/scripts/bundle.js", // Entry point for Vite
    },
  }
});