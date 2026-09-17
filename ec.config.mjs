import { defineEcConfig } from "astro-expressive-code";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

/*
 * The copy button's own words.
 *
 * Expressive Code writes its chrome in English, and the texts for it live in
 * `@expressive-code/plugin-frames`, which this project does not depend on. The
 * button is relabelled on the rendered tree instead, which is the same surface
 * `prose.css` already reaches with `.expressive-code .copy button`.
 *
 * The hook is addressed to the copy button alone: inside a code block it is the
 * only button there is, and the title is its tooltip.
 *
 * The copied-text attribute is found rather than named, because the tree spells
 * it `dataCopied` and the serialiser writes it out as `data-copied`; setting the
 * hyphenated name outright leaves both on the element.
 */
const japaneseCopyButton = {
  name: "japanese-copy-button",
  hooks: {
    postprocessRenderedBlock: ({ renderData }) => {
      const relabel = (node) => {
        if (node?.type !== "element") return false;
        const properties = node.properties ?? {};
        if (node.tagName === "button" && properties.title !== undefined) {
          properties.title = "クリップボードにコピー";
          const copied = Object.keys(properties).find(
            (key) => key.toLowerCase().replace(/-/g, "") === "datacopied",
          );
          properties[copied ?? "data-copied"] = "コピーしました";
          return true;
        }
        return (node.children ?? []).some(relabel);
      };

      relabel(renderData.blockAst);
    },
  },
};

/*
 * Kanagawa is a light/dark pair drawn from one palette, inspired by ukiyo-e
 * woodblock printing. Its colours are muted and low in saturation, which keeps a
 * code block from shouting on a page built for reading, and because both themes
 * come from the same family a block reads as one system whichever is active.
 */
export default defineEcConfig({
  plugins: [
    pluginCollapsibleSections(),
    pluginLineNumbers(),
    japaneseCopyButton,
  ],
  themes: ["kanagawa-lotus", "kanagawa-wave"],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) =>
    `[data-theme="${theme.type === "dark" ? "night" : "nord"}"]`,
  styleOverrides: {
    codeFontFamily: "var(--font-mplus-code), var(--font-emoji), monospace",
    uiFontFamily: "var(--font-mplus), var(--font-emoji), sans-serif",
    // The frame takes the page theme's own panel surface and corner radius
    // instead of the syntax theme's, so a code block belongs to the page it sits
    // in. `prose.css` points inline code at the same two tokens.
    codeBackground: "var(--color-base-200)",
    borderRadius: "var(--radius-box)",
  },
});
