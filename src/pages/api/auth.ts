export const prerender = false;

import { env } from "cloudflare:workers";
import type { APIContext, APIRoute } from "astro";
import { verifyPassword } from "../../utils/argon2-verify";
import { isValidPassword } from "../../utils/password";
import { getVaultEntry } from "../../utils/posts";
import { TURNSTILE_ACTION, verifyTurnstile } from "../../utils/turnstile";
import { storeUnlock } from "../../utils/vault-auth";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const handlePost = async ({
  request,
  session,
  clientAddress,
  site,
  url,
}: APIContext) => {
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
    return json({ ok: false, error: "server" }, 400);
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
    return json({ ok: false, error: "blocked" }, 403);
  }

  const post = await getVaultEntry(slug);
  if (post === undefined) {
    return json({ ok: false, error: "server" }, 404);
  }

  if (!isValidPassword(password)) {
    return json({ ok: false, error: "invalid" });
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

  if (result.errcode === 0) {
    await session.regenerate();

    let userid = await session.get("userid");
    if (userid === undefined) {
      userid = crypto.randomUUID();
      session.set("userid", userid);
    }

    await storeUnlock(env.DB, userid, slug, Math.floor(Date.now() / 1000));

    return json({ ok: true, redirect: `/vault/${slug}` });
  }

  if (result.errcode === 6) {
    return json({ ok: false, error: "invalid" });
  }

  return json({ ok: false, error: "server" }, 502);
};

export const POST: APIRoute = async (context) => {
  try {
    return await handlePost(context);
  } catch {
    return json({ ok: false, error: "server" }, 500);
  }
};
