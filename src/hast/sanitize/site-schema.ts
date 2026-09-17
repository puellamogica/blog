/*
 * What this site emits as raw HTML, on top of the vendored defaults in
 * `schema.ts`.
 *
 * Only raw HTML is filtered, so this list is short by construction: Markdown's
 * own elements are built by the parser and keep their attributes. What is left
 * is the HTML authors write by hand, and the HTML a plugin generates.
 */

export const SITE_TAG_NAMES: readonly string[] = [
  /*
   * Media is plain HTML in the source, so the browser's own player stays as the
   * no-JS fallback until Plyr upgrades it.
   */
  "audio",
  "video",
  /*
   * `mdast-katex` renders TeX through KaTeX, whose output is a MathML tree plus
   * an HTML layout layer, and emits the whole thing as raw HTML. Every element
   * of that output has to survive or the maths breaks.
   */
  "math",
  "semantics",
  "annotation",
  "annotation-xml",
  "mrow",
  "mi",
  "mn",
  "mo",
  "mtext",
  "mspace",
  "msup",
  "msub",
  "msubsup",
  "mfrac",
  "msqrt",
  "mroot",
  "mover",
  "munder",
  "munderover",
  "mtable",
  "mtr",
  "mtd",
  "mstyle",
  "mpadded",
  "mphantom",
  "menclose",
  /*
   * KaTeX draws what it cannot take from a font — the radical of a root, a
   * stretchy brace, the arrow over a vector — as inline SVG beside the MathML.
   * Those elements have to survive with it: unwrapped, the drawing disappears
   * while the space it reserved stays, which is what pushed the numerator of a
   * fraction off its centre.
   */
  "svg",
  "path",
  "line",
];

/*
 * `span` is replaced rather than extended because the merge is shallow: KaTeX's
 * layout layer is spans wearing classes and inline lengths, and `aria-hidden`
 * keeps that layer out of the accessibility tree where the MathML already says
 * the same thing.
 */
export const SITE_ATTRIBUTES: Readonly<Record<string, readonly string[]>> = {
  audio: ["src", "controls", "loop", "muted", "preload"],
  video: [
    "src",
    "controls",
    "loop",
    "muted",
    "preload",
    "playsinline",
    "poster",
    "width",
    "height",
  ],
  span: ["className", "style", "aria-hidden"],
  /*
   * The drawing's own geometry, and nothing else: no `href`, so an SVG cannot
   * carry a link, and no event handlers are reachable from here anyway.
   *
   * `viewBox` and `preserveAspectRatio` are camelCase in SVG. HTML lower-cases
   * attribute names, so they are restored to their canonical spelling in
   * `filter.ts`; serialized as `viewbox` the drawing would lose its coordinate
   * system.
   */
  svg: ["xmlns", "width", "height", "viewBox", "preserveAspectRatio", "style"],
  path: ["d"],
  line: ["x1", "y1", "x2", "y2", "stroke-width"],
  math: ["xmlns", "display"],
  annotation: ["encoding"],
  "annotation-xml": ["encoding"],
};

/** `poster` holds a URL like any other media attribute. */
export const SITE_PROTOCOLS: Readonly<Record<string, readonly string[]>> = {
  poster: ["http", "https"],
};
