// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "20190716.xyz";
export const SITE_DESCRIPTION =
  "A personal blog about building things on the web.";

/*
 * The wordmark sets the name and the top-level domain in different faces, so
 * both halves are derived from the one source rather than repeated here.
 */
const [siteName = SITE_TITLE, ...siteTld] = SITE_TITLE.split(".");
export const SITE_WORDMARK = { name: siteName, suffix: siteTld.join(".") };

export const DEFAULT_VAULT_QUESTION = "What is the password?";

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

export const SOCIAL_LINKS = [
  {
    href: "https://m.webtoo.ls/@astro",
    name: "Mastodon",
    label: "Follow Astro on Mastodon",
    icon: "mastodon",
  },
  {
    href: "https://twitter.com/astrodotbuild",
    name: "Twitter",
    label: "Follow Astro on Twitter",
    icon: "twitter",
  },
  {
    href: "https://github.com/withastro/astro",
    name: "GitHub",
    label: "Go to Astro's GitHub repository",
    icon: "github",
  },
] as const;
