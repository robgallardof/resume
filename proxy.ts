import { NextRequest, NextResponse } from "next/server";

/**
 * Password gate for the whole résumé.
 *
 * Every request — pages, RSC payloads and the `/_next/static` chunks that carry the résumé text —
 * is blocked until the visitor posts the password configured in the `CV_PASSWORD` environment
 * variable. A valid login sets an HttpOnly cookie holding an HMAC derived from that password, so
 * changing `CV_PASSWORD` signs everybody out. Without `CV_PASSWORD` the site stays locked.
 */

const COOKIE_NAME = "cv_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const LOGIN_PATH = "/__access";
const LOGOUT_PATH = "/__logout";
const FAILED_LOGIN_DELAY_MS = 800;

const encoder = new TextEncoder();

/** HMAC-SHA256 of a fixed label, keyed with the password, as hex. */
async function accessToken(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode("cv-access-v1"));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Length-independent string comparison. */
function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/** Only same-site relative paths are allowed as a post-login destination. */
function safeNext(value: unknown): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")
    ? value
    : "/";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

type Copy = { title: string; intro: string; label: string; button: string; error: string; disabled: string };

const COPY: Record<"en" | "es", Copy> = {
  en: {
    title: "Private résumé",
    intro: "This résumé is shared by invitation. Enter the password you received.",
    label: "Password",
    button: "View résumé",
    error: "Wrong password. Please try again.",
    disabled: "Access is not configured yet. Please contact Roberto Gallardo.",
  },
  es: {
    title: "CV privado",
    intro: "Este CV se comparte por invitación. Escribe la clave que recibiste.",
    label: "Clave",
    button: "Ver CV",
    error: "Clave incorrecta. Inténtalo de nuevo.",
    disabled: "El acceso aún no está configurado. Contacta a Roberto Gallardo.",
  },
};

function pickLanguage(request: NextRequest): "en" | "es" {
  const cookie = request.cookies.get("language")?.value;
  if (cookie === "en" || cookie === "es") return cookie;
  return /^es\b/i.test(request.headers.get("accept-language") ?? "") ? "es" : "en";
}

function loginPage(request: NextRequest, next: string, state: "form" | "error" | "disabled", status: number) {
  const lang = pickLanguage(request);
  const t = COPY[lang];
  const message =
    state === "error" ? `<p class="msg" role="alert">${t.error}</p>` : state === "disabled" ? `<p class="msg">${t.disabled}</p>` : "";
  const form =
    state === "disabled"
      ? ""
      : `<form method="post" action="${LOGIN_PATH}">
      <input type="hidden" name="next" value="${escapeHtml(next)}">
      <label for="password">${t.label}</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
      <button type="submit">${t.button}</button>
    </form>`;

  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Roberto Gallardo · ${t.title}</title>
<style>
  :root { --bg:#f5f5f7; --card:#fff; --fg:#111827; --muted:#6b7280; --border:#e5e7eb; --primary:#6d28d9; --danger:#b91c1c; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#0b0b0f; --card:#17171c; --fg:#f3f4f6; --muted:#9ca3af; --border:#2a2a33; --primary:#a78bfa; --danger:#f87171; }
  }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; display:grid; place-items:center; padding:16px;
         background:var(--bg); color:var(--fg); font:16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { width:100%; max-width:380px; background:var(--card); border:1px solid var(--border);
         border-radius:16px; padding:32px 28px; box-shadow:0 10px 30px rgb(0 0 0 / .08); }
  .badge { width:44px; height:44px; border-radius:12px; display:grid; place-items:center;
           background:var(--primary); color:#fff; font-weight:700; margin-bottom:16px; }
  h1 { font-size:1.35rem; margin:0 0 4px; }
  p { margin:0 0 20px; color:var(--muted); font-size:.95rem; }
  label { display:block; font-size:.85rem; font-weight:600; margin-bottom:6px; }
  input[type=password] { width:100%; padding:10px 12px; border-radius:10px; border:1px solid var(--border);
           background:transparent; color:var(--fg); font-size:1rem; }
  input[type=password]:focus { outline:2px solid var(--primary); outline-offset:1px; }
  button { width:100%; margin-top:14px; padding:11px; border:0; border-radius:10px; cursor:pointer;
           background:var(--primary); color:#fff; font-weight:600; font-size:1rem; }
  .msg { color:var(--danger); margin:-8px 0 16px; }
  footer { margin-top:20px; font-size:.8rem; color:var(--muted); text-align:center; }
  footer a { color:inherit; }
</style>
</head>
<body>
  <main>
    <div class="badge" aria-hidden="true">RG</div>
    <h1>${t.title}</h1>
    <p>${t.intro}</p>
    ${message}
    ${form}
    <footer><a href="https://robertogallardo.dev">robertogallardo.dev</a></footer>
  </main>
</body>
</html>`;

  return new NextResponse(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export async function proxy(request: NextRequest) {
  const password = process.env.CV_PASSWORD;
  const { pathname, search } = request.nextUrl;

  if (!password) {
    return loginPage(request, "/", "disabled", 503);
  }

  const expected = await accessToken(password);

  if (pathname === LOGOUT_PATH) {
    const response = NextResponse.redirect(new URL("/", request.url), 303);
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  if (pathname === LOGIN_PATH && request.method === "POST") {
    const form = await request.formData();
    const next = safeNext(form.get("next"));
    const attempt = form.get("password");

    if (typeof attempt === "string" && safeEqual(await accessToken(attempt), expected)) {
      const response = NextResponse.redirect(new URL(next, request.url), 303);
      response.cookies.set(COOKIE_NAME, expected, {
        httpOnly: true,
        secure: request.nextUrl.protocol === "https:",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      });
      return response;
    }

    await new Promise((resolve) => setTimeout(resolve, FAILED_LOGIN_DELAY_MS));
    return loginPage(request, next, "error", 401);
  }

  if (safeEqual(request.cookies.get(COOKIE_NAME)?.value ?? "", expected)) {
    return NextResponse.next();
  }

  const wantsHtml = (request.headers.get("accept") ?? "").includes("text/html");
  if (wantsHtml) {
    const next = pathname === LOGIN_PATH ? "/" : safeNext(pathname + search);
    return loginPage(request, next, "form", 401);
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "cache-control": "no-store" },
  });
}

export const config = {
  // Everything, including /_next/static, except the favicon.
  matcher: ["/((?!favicon.ico$).*)"],
};
