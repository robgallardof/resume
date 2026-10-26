import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { proxy } from "@/proxy";
import { COOKIE_NAME, accessToken } from "@/lib/access";

/**
 * End-to-end behaviour of the password gate, driving proxy() with real NextRequest objects.
 */

const BASE = "https://cv.example.test";
const PASSWORD = "integration-secret";

function get(path: string, init: { accept?: string; cookie?: string; lang?: string } = {}) {
  const headers = new Headers();
  if (init.accept) headers.set("accept", init.accept);
  if (init.cookie) headers.set("cookie", init.cookie);
  if (init.lang) headers.set("accept-language", init.lang);
  return new NextRequest(`${BASE}${path}`, { headers });
}

function login(password: string, next = "/") {
  return new NextRequest(`${BASE}/__access`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "text/html" },
    body: new URLSearchParams({ password, next }).toString(),
  });
}

const passesThrough = (res: Response) => res.headers.get("x-middleware-next") === "1";

beforeEach(() => vi.stubEnv("CV_PASSWORD", PASSWORD));
afterEach(() => vi.unstubAllEnvs());

describe("without access", () => {
  it("answers page requests with the login modal and no résumé data", async () => {
    const res = await proxy(get("/", { accept: "text/html", lang: "es-MX" }));
    expect(res.status).toBe(401);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("x-robots-tag")).toContain("noindex");
    const html = await res.text();
    expect(html).toContain('action="/__access"');
    expect(html).toContain("CV privado");
    expect(html).not.toMatch(/Geodis|8228|robgallardofl/);
  });

  it("blocks JavaScript chunks and data requests", async () => {
    for (const path of ["/_next/static/chunks/app.js", "/?_rsc=abc", "/api/anything"]) {
      const res = await proxy(get(path));
      expect(res.status).toBe(401);
      expect(passesThrough(res)).toBe(false);
    }
  });

  it("rejects a forged cookie", async () => {
    const res = await proxy(get("/", { accept: "text/html", cookie: `${COOKIE_NAME}=${"0".repeat(64)}` }));
    expect(res.status).toBe(401);
  });
});

describe("login", () => {
  it("shows an error for a wrong password and sets no cookie", async () => {
    const res = await proxy(login("wrong"));
    expect(res.status).toBe(401);
    expect(res.headers.get("set-cookie")).toBeNull();
    expect(await res.text()).toContain('role="alert"');
  });

  it("sets an HttpOnly cookie and redirects for the right password", async () => {
    const res = await proxy(login(PASSWORD, "/?lang=es"));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(`${BASE}/?lang=es`);
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toContain(`${COOKIE_NAME}=${await accessToken(PASSWORD)}`);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/Secure/i);
    expect(cookie).toMatch(/SameSite=lax/i);
  });

  it("never redirects to another site", async () => {
    const res = await proxy(login(PASSWORD, "//evil.example"));
    expect(res.headers.get("location")).toBe(`${BASE}/`);
  });
});

describe("with access", () => {
  it("lets every request through", async () => {
    const cookie = `${COOKIE_NAME}=${await accessToken(PASSWORD)}`;
    for (const path of ["/", "/_next/static/chunks/app.js"]) {
      expect(passesThrough(await proxy(get(path, { accept: "text/html", cookie })))).toBe(true);
    }
  });

  it("is revoked when the password changes", async () => {
    const cookie = `${COOKIE_NAME}=${await accessToken(PASSWORD)}`;
    vi.stubEnv("CV_PASSWORD", "rotated-password");
    expect((await proxy(get("/", { accept: "text/html", cookie }))).status).toBe(401);
  });

  it("signs out on /__logout", async () => {
    const res = await proxy(get("/__logout"));
    expect(res.status).toBe(303);
    expect(res.headers.get("set-cookie")).toMatch(new RegExp(`${COOKIE_NAME}=;`));
  });
});
