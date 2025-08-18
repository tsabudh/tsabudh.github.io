import { HtmlBasePlugin } from "@11ty/eleventy";
import pluginVite from "@11ty/eleventy-plugin-vite";
import viteConfig from "./vite.config.js";
import dirOutputPlugin from "@11ty/eleventy-plugin-directory-output";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import * as sass from "sass";
import path from "path";

export default function (eleventyConfig) {
  eleventyConfig.addWatchTarget("src/styles/**/*.css");
  eleventyConfig.addWatchTarget("src/styles/scss/**/*.scss");
  eleventyConfig.addWatchTarget("src/scripts/**/*.js");

  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("src/scripts");

  eleventyConfig.addPlugin(dirOutputPlugin);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(pluginVite, {
    viteOptions: viteConfig,
  });


  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    useLayouts: false,

    compile: async function (inputContent, inputPath) {
      const parsed = path.parse(inputPath);
      // if (parsed.name !== "main") return;
      // if (parsed.name.startsWith("_")) return;

      const result = sass.compileString(inputContent, {
        style: "compressed",
        loadPaths: [parsed.dir, this.config.dir.includes],
      });
      this.addDependencies(inputPath, result.loadedUrls);

      return async (data) => {
        return result.css;
      };
    },
    compileOptions: {
      permalink: (contents, inputPath) => {
        const parsed = path.parse(inputPath);

        if (parsed.name !== "main") return false;
        if (parsed.name.startsWith("_")) return false;
        return "styles/compiled.css";
      },
    },
  });

  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",

    compile: async function (inputContent, inputPath) {
      return async () => {
        const result = await postcss([tailwindcss()]).process(inputContent, {
          from: inputPath,
        });
        return result.css;
      };
    },
  });

  return {
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk", "css", "scss"],
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
  };
}
