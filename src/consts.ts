// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Astro Blog";
export const SITE_DESCRIPTION = "Welcome to my website!";

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
