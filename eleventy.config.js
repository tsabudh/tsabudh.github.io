import { HtmlBasePlugin } from "@11ty/eleventy";
import postcss from "postcss";
import tailwindcss from '@tailwindcss/postcss';




export default function (eleventyConfig) {
    eleventyConfig.addPlugin(HtmlBasePlugin);
    eleventyConfig.addWatchTarget("src/styles/**/*.css");
    eleventyConfig.addWatchTarget("src/scripts/**/*.css");
    eleventyConfig.addPassthroughCopy("src/scripts");
    eleventyConfig.addPassthroughCopy("src/fonts");

    eleventyConfig.addExtension("css", {
        outputFileExtension: "css",

        compile: async function (inputContent, inputPath) {
            return async () => {
                const result = await postcss([tailwindcss()])
                    .process(inputContent, { from: inputPath });
                return result.css;
            };
        },
    });


    return {
        htmlTemplateEngine: "njk",
        templateFormats: ["html", "njk", "css"],
        dir: {
            input: "src",
            includes: "_includes",
            data: "_data"
        }
    }
}
