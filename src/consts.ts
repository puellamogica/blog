// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "20190716.xyz";
export const SITE_DESCRIPTION = "ウェブでつくることについての個人ブログです。";

/*
 * The wordmark sets the name and the top-level domain apart, so both halves are
 * derived from the one source rather than repeated here.
 */
const [siteName = SITE_TITLE, ...siteTld] = SITE_TITLE.split(".");
export const SITE_WORDMARK = { name: siteName, suffix: siteTld.join(".") };

export const DEFAULT_VAULT_QUESTION = "パスワードは何ですか？";

export const VAULT_ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const;

export const NAV_ITEMS = [
  { href: "/", label: "ホーム", match: ["/"] },
  { href: "/posts", label: "記事", match: ["/posts", "/article"] },
  { href: "/about", label: "プロフィール", match: ["/about"] },
] as const;
