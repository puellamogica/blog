/*
 * The character profile on /about.
 *
 * One source of truth, the way the categories are: the page derives both the
 * name block and the spec list from here, so a correction is a one-line edit
 * rather than a hunt through markup.
 *
 * The spec list is ordered as the source page orders it, which is not the order
 * a Western form would use. That order is the point — it reads as a character
 * sheet rather than a form field dump.
 */
export const profile = {
  romanised: "AKIYAMA MIZUKI",
  name: "暁山 瑞希",
  voice: "佐藤 日向",
  unit: "25時、ナイトコードで。",
  role: "動画担当",
  quote: "ボクは、ボクのままでいいのかなって、思えたんだ",
} as const;

export type Fact = { label: string; value: string };

export const facts: Fact[] = [
  { label: "性別", value: "?" },
  { label: "誕生日", value: "8月27日" },
  { label: "身長", value: "165cm" },
  { label: "学校", value: "神山高校" },
  { label: "学年", value: "2-B" },
  { label: "趣味", value: "動画素材集め、コラージュ" },
  { label: "特技", value: "洋服のアレンジ" },
  { label: "苦手なもの", value: "熱い食べ物" },
];
