/*
 * Cache directives for the responses the Worker renders per request.
 *
 * `/vault/…`, `/login/…` and `/api/auth` all carry a session, so nothing
 * between here and the reader may store them. This is the origin-side half of
 * the story: the assets layer's `public/_headers` covers the static files, and
 * a Cache Rule in the dashboard can only bypass the edge — it cannot tell the
 * browser anything the origin did not.
 */
export const NO_STORE = { "cache-control": "no-store" } as const;

/** Marks an already-built response — a redirect or a bare 404 — as unstorable. */
export const noStore = (response: Response): Response => {
  response.headers.set("cache-control", "no-store");
  return response;
};

export const jsonResponse = (
  body: unknown,
  status = 200,
  extra: Record<string, string> = {},
): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...NO_STORE, ...extra },
  });
