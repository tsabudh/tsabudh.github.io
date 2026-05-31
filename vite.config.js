import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: "/", // GitHub Pages root (tsabudh.github.io)
  root: ".", // project root
  plugins: [
    viteStaticCopy({
      targets: [{ src: "CNAME", dest: "." }],
    }),
  ],
  build: {
    outDir: "_site", // Eleventy’s output folder
    emptyOutDir: true, // clean before build
    rollupOptions: {
      input: resolve(__dirname, "src/main.js"), // entry point
    },
  }
});
