import { env, passwordOk, makeToken, json } from "../lib/auth.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  if (!env("ADMIN_PASSWORD")) return json({ error: "not_configured" }, 500);
  let body = {};
  try { body = await req.json(); } catch {}
  if (!passwordOk(String(body.password || ""))) {
    await new Promise((r) => setTimeout(r, 700)); // slow down guessing
    return json({ error: "wrong" }, 401);
  }
  return json(makeToken());
};

export const config = { path: "/api/login" };
