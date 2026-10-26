/**
 * Helpers for the password gate in `proxy.ts`. Kept free of Next.js types so they can be unit tested.
 */

export const COOKIE_NAME = "cv_access";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
export const LOGIN_PATH = "/__access";
export const LOGOUT_PATH = "/__logout";
export const TOKEN_LABEL = "cv-access-v1";
/** HMAC-SHA256(key = default password, message = TOKEN_LABEL). The password itself is never stored. */
export const DEFAULT_TOKEN = "4cfbfe8573ecf61c3670455f98b040c9da49444d98c857ff2f7ba776434d3fdc";

const encoder = new TextEncoder();

/** HMAC-SHA256 of a fixed label, keyed with the password, as lowercase hex. */
export async function accessToken(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(TOKEN_LABEL));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Token the cookie must carry: from `CV_PASSWORD` when set, otherwise the default. */
export async function expectedToken(password: string | undefined): Promise<string> {
  return password ? accessToken(password) : DEFAULT_TOKEN;
}

/** Length-independent string comparison. */
export function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/** Only same-site relative paths are allowed as a post-login destination. */
export function safeNext(value: unknown): string {
  return typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\")
    ? value
    : "/";
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** Language cookie first, then the browser's Accept-Language header. */
export function pickLanguage(cookie: string | undefined, acceptLanguage: string | null): "en" | "es" {
  if (cookie === "en" || cookie === "es") return cookie;
  return /^es\b/i.test(acceptLanguage ?? "") ? "es" : "en";
}
