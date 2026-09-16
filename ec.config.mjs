import { defineEcConfig } from "astro-expressive-code";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

export default defineEcConfig({
  plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
  themes: ["catppuccin-macchiato", "catppuccin-latte"],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) =>
    `[data-theme="${theme.type === "dark" ? "sumi" : "washi"}"]`,
  styleOverrides: {
    codeFontFamily: "var(--font-mplus-code), var(--font-emoji), monospace",
    uiFontFamily: "var(--font-mplus), var(--font-emoji), sans-serif",
    // The code frame is square like everything else on the page.
    borderRadius: "0px",
  },
});
