import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const env = (k) => (globalThis.Netlify?.env?.get?.(k)) ?? process.env[k];

const HOURS = 12;
const sha = (s) => createHash("sha256").update(String(s)).digest();
const key = () => sha("awfc-fines:" + (env("ADMIN_PASSWORD") || "") + ":" + (env("TOKEN_SECRET") || ""));
const b64 = (buf) => Buffer.from(buf).toString("base64url");

export function passwordOk(given) {
  const real = env("ADMIN_PASSWORD");
  if (!real) return false;
  return timingSafeEqual(sha(given), sha(real));
}

export function makeToken() {
  const exp = Date.now() + HOURS * 3600 * 1000;
  const payload = String(exp);
  const sig = b64(createHmac("sha256", key()).update(payload).digest());
  return { token: b64(payload) + "." + sig, exp };
}

export function tokenOk(req) {
  const h = req.headers.get("authorization") || "";
  const t = h.startsWith("Bearer ") ? h.slice(7) : "";
  const [p, sig] = t.split(".");
  if (!p || !sig || !env("ADMIN_PASSWORD")) return false;
  const payload = Buffer.from(p, "base64url").toString();
  const expect = b64(createHmac("sha256", key()).update(payload).digest());
  if (expect.length !== sig.length || !timingSafeEqual(Buffer.from(expect), Buffer.from(sig))) return false;
  return Number(payload) > Date.now();
}

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
