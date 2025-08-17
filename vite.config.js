import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "_site",
    emptyOutDir: false,
    rollupOptions: {
      input: "./src/scripts/barba.js", // Entry point for Vite
    },
  }
});