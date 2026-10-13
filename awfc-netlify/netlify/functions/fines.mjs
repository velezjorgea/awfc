import { getStore } from "@netlify/blobs";
import { tokenOk, json } from "../lib/auth.mjs";

const KEY = "state";

function valid(s) {
  return s && typeof s === "object" && Array.isArray(s.players) && Array.isArray(s.tariff) &&
    s.season && typeof s.season === "object" && s.weeks && typeof s.weeks === "object" && !Array.isArray(s.weeks);
}

export default async (req) => {
  const store = getStore({ name: "awfc-fines", consistency: "strong" });

  if (req.method === "GET") {
    const r = await store.getWithMetadata(KEY, { type: "json" });
    return json({ state: r ? r.data : null, etag: r ? r.etag : null });
  }

  if (req.method === "POST") {
    if (!tokenOk(req)) return json({ error: "auth" }, 401);
    let body;
    try { body = await req.json(); } catch { return json({ error: "bad_json" }, 400); }
    if (!valid(body?.state)) return json({ error: "bad_data" }, 400);
    if (JSON.stringify(body.state).length > 3_000_000) return json({ error: "too_large" }, 413);
    const opts = body.etag ? { onlyIfMatch: body.etag } : { onlyIfNew: true };
    const res = await store.setJSON(KEY, body.state, opts);
    if (!res.modified) return json({ error: "conflict" }, 409);
    return json({ ok: true, etag: res.etag });
  }

  return json({ error: "method" }, 405);
};

export const config = { path: "/api/fines" };
