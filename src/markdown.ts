import type { Features } from "satteri";

export const markdownFeatures = {
  gfm: {
    footnotes: {
      label: "注釈",
      backContent: "↑",
      backLabel: "注釈{reference}に戻る",
    },
  },
  math: true,
  smartPunctuation: true,
} satisfies Features;
