// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Puella Mogica";
export const SITE_DESCRIPTION = "An astro framework blog theme";

/*
 * The wordmark sets the name and the top-level domain apart, so both halves are
 * derived from the one source rather than repeated here.
 */
const [siteName = SITE_TITLE, ...siteTld] = SITE_TITLE.split(".");
export const SITE_WORDMARK = { name: siteName, suffix: siteTld.join(".") };

/*
 * The loader animation, served from the same object storage as the weather
 * snapshot so the site keeps one origin for its runtime assets.
 */
export const LOADING_ANIMATION_URL =
  "https://object.amia.work/assets/loading.json";

export const DEFAULT_VAULT_QUESTION = "パスワードは何ですか？";

export const VAULT_ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const;

export const NAV_ITEMS = [
  { href: "/", label: "Home", match: ["/"] },
  { href: "/posts", label: "Posts", match: ["/posts", "/article"] },
  { href: "/about", label: "About", match: ["/about"] },
] as const;
