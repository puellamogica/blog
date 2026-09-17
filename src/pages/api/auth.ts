export const prerender = false;

import { env } from "cloudflare:workers";
import type { APIContext, APIRoute } from "astro";
import { isVerified, verifyPassword } from "../../utils/argon2-verify";
import { jsonResponse } from "../../utils/http";
import { isValidPassword } from "../../utils/password";
import { getVaultEntry } from "../../utils/posts";
import { allowRequest } from "../../utils/rate-limit";
import { TURNSTILE_ACTION, verifyTurnstile } from "../../utils/turnstile";
import { storeUnlock } from "../../utils/vault-auth";

const IP_LIMIT_RETRY_AFTER_SECONDS = "10";
const SLUG_LIMIT_RETRY_AFTER_SECONDS = "60";

const rateLimited = (retryAfter: string) =>
  jsonResponse({ ok: false, error: "rate_limited" }, 429, {
    "retry-after": retryAfter,
  });

const handlePost = async ({
  request,
  session,
  clientAddress,
  site,
  url,
}: APIContext) => {
  /*
   * Every check below this point either costs a network round trip or an Argon2
   * verification, so the cheapest refusal goes first.
   */
  if (!(await allowRequest(env.AUTH_IP_RATE_LIMIT, clientAddress))) {
    console.error(
      JSON.stringify({
        message: "auth rate limited",
        scope: "address",
        address: clientAddress,
      }),
    );
    return rateLimited(IP_LIMIT_RETRY_AFTER_SECONDS);
  }

  const form = await request.formData();
  const slug = form.get("slug");
  const password = form.get("password");
  const token = form.get("cf-turnstile-response");

  if (
    typeof slug !== "string" ||
    slug === "" ||
    typeof password !== "string" ||
    session === undefined
  ) {
    return jsonResponse({ ok: false, error: "server" }, 400);
  }

  /*
   * A per-address limit cannot bound guesses against one post — a rotating set
   * of addresses never trips it. This one can, which is what keeps a distributed
   * attempt on a single vault entry finite.
   */
  if (!(await allowRequest(env.AUTH_SLUG_RATE_LIMIT, slug))) {
    console.error(
      JSON.stringify({
        message: "auth rate limited",
        scope: "post",
        slug,
        address: clientAddress,
      }),
    );
    return rateLimited(SLUG_LIMIT_RETRY_AFTER_SECONDS);
  }

  const allowedHostnames = new Set<string>();
  if (site !== undefined) {
    allowedHostnames.add(site.hostname);
  }
  if (import.meta.env.DEV) {
    allowedHostnames.add(url.hostname);
  }

  const verified = await verifyTurnstile({
    token: typeof token === "string" ? token : "",
    secret: await env.TURNSTILE_SECRET.get(),
    remoteIp: clientAddress,
    action: TURNSTILE_ACTION,
    allowedHostnames,
  });

  if (!verified) {
    return jsonResponse({ ok: false, error: "blocked" }, 403);
  }

  const post = await getVaultEntry(slug);
  if (post === undefined) {
    return jsonResponse({ ok: false, error: "server" }, 404);
  }

  if (!isValidPassword(password)) {
    return jsonResponse({ ok: false, error: "invalid" });
  }

  const [endpoint, hmacSecret, bypass] = await Promise.all([
    env.ARGON2_ENDPOINT.get(),
    env.ARGON2_HMAC_SECRET.get(),
    env.VERCEL_PROTECTION_BYPASS.get(),
  ]);

  const result = await verifyPassword({
    hash: post.data.passwordHash,
    input: password,
    endpoint,
    hmacSecret,
    bypass,
  });

  if (isVerified(result)) {
    await session.regenerate();

    let userid = await session.get("userid");
    if (userid === undefined) {
      userid = crypto.randomUUID();
      session.set("userid", userid);
    }

    await storeUnlock(env.DB, userid, slug, Math.floor(Date.now() / 1000));

    return jsonResponse({ ok: true, redirect: `/vault/${slug}` });
  }

  if (result.errcode === 6) {
    console.error(
      JSON.stringify({
        message: "unlock mismatch",
        slug,
        address: clientAddress,
      }),
    );
    return jsonResponse({ ok: false, error: "invalid" });
  }

  return jsonResponse({ ok: false, error: "server" }, 502);
};

export const POST: APIRoute = async (context) => {
  try {
    return await handlePost(context);
  } catch {
    return jsonResponse({ ok: false, error: "server" }, 500);
  }
};
