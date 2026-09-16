// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import expressiveCode from "astro-expressive-code";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { satteri } from "@astrojs/markdown-satteri";
import { mdastKatexPlugin } from "./src/mdast/mdast-katex";
import { mdastQuestionHtmlPlugin } from "./src/mdast/mdast-question-html";
import { mdastReadingTimePlugin } from "./src/mdast/mdast-reading-time";
import { hastExternalLinks } from "./src/hast/hast-external-links";
import { hastEagerImages } from "./src/hast/hast-eager-images";
import { markdownFeatures } from "./src/markdown";

// https://astro.build/config
export default defineConfig({
  site: "https://20190716.xyz",
  trailingSlash: "never",
  adapter: cloudflare({
    imageService: {
      build: "cloudflare-binding",
      runtime: "cloudflare-binding",
    },
  }),
  integrations: [
    expressiveCode(),
    sitemap({
      filter: (page) =>
        !page.includes("/vault/") &&
        !page.includes("/login/") &&
        !page.includes("/api/"),
    }),
  ],
  vite: {
    build: {
      minify: false,
    },
    plugins: [tailwindcss()],
  },
  session: {
    cookie: {
      sameSite: "strict",
      maxAge: 604800,
    },
    ttl: 604800,
  },
  markdown: {
    processor: satteri({
      features: markdownFeatures,
      mdastPlugins: [
        mdastReadingTimePlugin,
        mdastQuestionHtmlPlugin,
        mdastKatexPlugin,
      ],
      hastPlugins: [hastExternalLinks, hastEagerImages],
    }),
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "M PLUS 1",
      cssVariable: "--font-mplus",
      weights: ["100 900"],
      subsets: ["latin", "latin-ext", "japanese"],
    },
    {
      provider: fontProviders.google(),
      name: "M PLUS 1 Code",
      cssVariable: "--font-mplus-code",
      fallbacks: ["monospace"],
      weights: ["100 700"],
      subsets: ["latin", "latin-ext", "japanese"],
    },
    {
      provider: fontProviders.googleicons(),
      name: "Material Symbols Outlined",
      cssVariable: "--font-symbol",
      weights: ["100 700"],
      /*
       * The icon font is subset to exactly the ligatures the site renders, so it
       * stays a couple of kilobytes instead of the ~3MB the full family weighs.
       * Add a name here when `Icon.astro` gains one.
       */
      options: {
        experimental: {
          glyphs: ["menu", "close", "light_mode", "dark_mode", "arrow_forward"],
        },
      },
      display: "block",
    },
    {
      provider: fontProviders.google(),
      name: "Noto Color Emoji",
      cssVariable: "--font-emoji",
      subsets: ["emoji"],
    },
  ],
});
