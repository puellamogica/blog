# Puella Mogica

A Japanese-language blog about _Project SEKAI_ and the character 暁山 瑞希, built with Astro and deployed as a Cloudflare Worker.

- **Site:** https://20190716.xyz
- **Stack:** Astro 7, TypeScript, Tailwind CSS v4, daisyUI 5
- **Runtime:** Cloudflare Workers — Workers Assets, Cloudflare Images, KV (sessions), D1 (vault unlocks)

## Features

- **Two content collections** — `article` (public) and `vault` (password-gated), both plain Markdown (GFM, no MDX) with schema-validated frontmatter.
- **Password-gated vault** — per-post argon2id hash, a Cloudflare Turnstile challenge on the unlock form, D1-backed unlock sessions with a TTL, and per-IP / per-slug rate limits.
- **Markdown pipeline** — GFM (footnotes, tables, task lists), KaTeX math, reading time, sanitized raw HTML, and eager images, all through one shared Sätteri processor.
- **Syntax-highlighted code** — Expressive Code with the Kanagawa light/dark pair, collapsible sections, and line numbers.
- **Post filter** — client-side category/year filtering that still works without JavaScript.
- **Weather widget** — a snapshot from a separate crawler Worker, normalized defensively and shown in JST.
- **Progressive enhancements** — Plyr media players, a PhotoSwipe lightbox, and a Swiper gallery, each dynamically imported only on pages that use them.
- **Feeds and metadata** — RSS, sitemap, `robots.txt`, and Open Graph / Twitter cards.
- **Light and dark themes** with an instant toggle.

## Project structure

```
├── migrations/            # D1 migrations (unlock table)
├── public/                # self-hosted static assets (icons, _headers)
├── scripts/               # authoring scripts (vault password hashing)
├── src/
│   ├── components/        # .astro components
│   ├── content/           # git submodule: article/, vault/, assets/
│   ├── data/              # categories and the character profile
│   ├── hast/              # HAST plugins + vendored HTML sanitizer
│   ├── layouts/           # BaseLayout and BlogPost
│   ├── mdast/             # MDAST plugins (KaTeX, reading time, question)
│   ├── pages/             # routes
│   ├── scripts/           # client-side enhancements
│   ├── styles/            # Tailwind entry and theme tokens
│   └── utils/             # pure, unit-tested helpers
├── test/                  # Vitest unit tests
├── astro.config.mjs
└── wrangler.jsonc
```

Path aliases: `@components/*`, `@layouts/*`, `@utils/*`, `@assets/*`.

Routes are prerendered except the gated ones: `login/[slug]`, `vault/[slug]`, and `api/auth` are server-rendered.

## Getting started

```sh
pnpm install
git submodule update --init   # content lives in a submodule
pnpm dev                      # http://localhost:4321
```

## Commands

| Command           | Action                                                        |
| :---------------- | :------------------------------------------------------------ |
| `pnpm dev`        | Start the dev server at `localhost:4321`                      |
| `pnpm build`      | Run `astro check` and build to `dist/`                        |
| `pnpm preview`    | Build, then preview the built Worker                          |
| `pnpm test`       | Run the Vitest suite (`vitestconfig.ts`)                      |
| `pnpm cf-typegen` | Regenerate `worker-configuration.d.ts` from `wrangler.jsonc`  |
| `pnpm hash:vault` | Interactively generate an argon2id hash for vault frontmatter |
| `pnpm deploy`     | Build and `wrangler deploy`                                   |

Lint TypeScript/JS with `pnpm exec eslint <files>` and CSS with `pnpm exec stylelint <files>`; Husky + lint-staged run both (plus Prettier) on commit.

## Writing content

Posts live in the content submodule under `src/content/article/<slug>.md` (public) or `src/content/vault/<slug>.md` (password-gated). Body content is GFM and uses `h2`–`h6` only — the layout owns the page `h1`. Per-post images sit next to the post in `src/content/assets/<collection>/<slug>/`.

Frontmatter fields, in addition to `slug`, `category` (`tech` / `life` / `notes`), `title`, `description`, `pubDate`, `updatedDate?`, `heroImage?`, `pinned`, and `draft`:

| Collection | Field          | Notes                                                                                         |
| :--------- | :------------- | :-------------------------------------------------------------------------------------------- |
| vault      | `question`     | Prompt shown on the unlock page (defaults to パスワードは何ですか？)                          |
| vault      | `passwordHash` | Required argon2id hash; must match `VAULT_ARGON2_OPTIONS`. Generate it with `pnpm hash:vault` |

Drafts are excluded everywhere — listings, RSS, sitemap, and generated routes.

## Configuration

Bindings, routes, and rate limits are declared in `wrangler.jsonc`:

- **Assets** (`ASSETS`) serve the built `dist/` output; **`IMAGES`** backs Cloudflare Images.
- **KV** (`SESSION`) stores sessions; **D1** (`DB`) stores vault unlocks (see `migrations/`).
- Secrets (`ARGON2_ENDPOINT`, `ARGON2_HMAC_SECRET`, `ARGON2_PEPPER`, `VERCEL_PROTECTION_BYPASS`, `TURNSTILE_SECRET`) are read from the Cloudflare secrets store, never from plaintext vars. `TURNSTILE_SITEKEY` is a public var.

Vault passwords are never verified in the Worker: the request is HMAC-signed and sent to a separate argon2 service, so no hashing code is bundled.

## Deployment

```sh
pnpm deploy
```

The Worker is bound to the `20190716.xyz` custom domain.

## Related repositories

- **`../cron`** — a Worker that crawls OpenWeatherMap and writes the `weather.json` snapshot the weather widget reads.
- **`../argon2`** — the HTTP service that verifies vault passwords.

## Credits

- Scaffolded from the [Astro blog starter](https://github.com/withastro/astro/tree/main/examples/blog), itself based on [Bear Blog](https://github.com/HermanMartinus/bearblog/).
- The HTML sanitizer in `src/hast/sanitize/` is vendored from [`satteri-sanitize`](https://github.com/Ashish-CodeJourney/satteri-plugins/tree/main/packages/satteri-sanitize) (MIT, © Ashish Vaghela); the KaTeX rendering under `src/mdast/` was extracted into this source the same way, from `satteri-katex`.

## License

Licensed under the Apache License, Version 2.0 — see [LICENSE](LICENSE).
