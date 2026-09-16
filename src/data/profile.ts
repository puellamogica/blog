/*
 * The character profile on /about.
 *
 * One source of truth, the way the categories are: the band, the table and the
 * description all derive from here, so a correction is a one-line edit rather
 * than a hunt through markup.
 */
export const profile = {
  romanised: "AKIYAMA MIZUKI",
  name: "暁山 瑞希",
  voice: "佐藤 日向",
  unit: "25時、ナイトコードで。",
  role: "動画担当",
  quote: "ボクは、ボクのままでいいかなって、思えたんだ",
} as const;

/*
 * The source page toggles between two points in the character's life, and only
 * three things actually differ: the height, the year, and the description.
 * Everything else is shared.
 *
 * So the era lives on the value rather than on the sheet. A string is true in
 * both eras; an object carries the one that is not. Writing the whole sheet out
 * twice would have meant keeping six identical rows in step by hand, and the
 * next difference would have had nowhere to go but a third copy.
 */
export type Value = string | { past: string; now: string };

export type Cell = { label: string; value: Value };

/*
 * The spec sheet is table-shaped, so it is stored as table rows rather than as
 * one flat list. A row is an array because the source page packs some rows with
 * two name/value pairs and leaves others at one, and that rhythm is the point:
 * flattening it would turn a character sheet into a form.
 *
 * The order is the source page's order, which is not the order a Western form
 * would use.
 */
export const rows: Cell[][] = [
  [{ label: "性別", value: "?" }],
  [
    { label: "誕生日", value: "8月27日" },
    { label: "身長", value: { past: "163cm", now: "165cm" } },
  ],
  [
    { label: "学校", value: "神山高校" },
    { label: "学年", value: { past: "1-A", now: "2-B" } },
  ],
  [{ label: "趣味", value: "動画素材集め、コラージュ" }],
  [{ label: "特技", value: "洋服のアレンジ" }],
  [{ label: "苦手なもの", value: "熱い食べ物" }],
];

/*
 * The two eras, in the order and with the default the source page uses: PAST
 * first, NOW current.
 *
 * Both descriptions are placeholders, carried over from the page this replaced.
 * The real text goes here and renders as it is written.
 */
export const eras = {
  past: {
    label: "PAST",
    description: [
      "見出しと本文の強弱、引用やコードブロックの余白、画像を挟んだときの流れなど、記事ページで起きることはひととおりこのページで試せます。実際の記事を書く前に、これらの要素が同じリズムで並ぶかどうかを確かめておくと、あとから崩れる心配がありません。",
      "段落の長さは揃えすぎないほうが自然に見えます。短い段落と長い段落が交互に並ぶと、紙面に緩急が生まれ、読み手の目が休まる場所を作れます。ここではその緩急も含めて、仮の文章として置いています。",
    ],
  },
  now: {
    label: "NOW",
    description: [
      "これはレイアウトを確認するためのダミーテキストです。文字の大きさ、行間、余白のバランスが意図どおりに見えるかを確かめるために置いています。実際の文章に差し替えるまでの仮の内容なので、ここに書かれていることに意味はありません。",
      "日本語の文章は、一文字あたりの情報量が多く、行頭と行末の位置が揃いやすいという特徴があります。そのぶん行間を十分に取らないと圧迫感が出るため、本文の行送りは英語よりも広めに設定しています。この段落も、そうした組みの確認を目的とした仮の文章です。",
    ],
  },
} as const;

export type Era = keyof typeof eras;

/*
 * PAST first, and NOW is what the page opens on, which is the way round the
 * source page has it.
 */
export const eraKeys = ["past", "now"] as const;
export const defaultEra: Era = "now";

/*
 * Placeholder source, to be replaced with the real file. The poster is an image
 * the page imports, so it lives there rather than here.
 */
export const video = {
  src: "/media/character.webm",
  title: "キャラクタームービー",
} as const;
