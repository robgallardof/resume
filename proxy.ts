import { NextRequest, NextResponse } from "next/server";

/**
 * Password gate for the whole résumé.
 *
 * Every request — pages, RSC payloads and the `/_next/static` chunks that carry the résumé text —
 * is blocked until the visitor posts the password. A valid login sets an HttpOnly cookie holding an
 * HMAC derived from the password, so changing the password signs everybody out.
 *
 * The password is the `CV_PASSWORD` environment variable when set; otherwise the default password,
 * stored here only as its HMAC token (never in plain text).
 */

const COOKIE_NAME = "cv_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const LOGIN_PATH = "/__access";
const LOGOUT_PATH = "/__logout";
const FAILED_LOGIN_DELAY_MS = 800;
const TOKEN_LABEL = "cv-access-v1";
/** HMAC-SHA256(key = default password, message = TOKEN_LABEL). */
const DEFAULT_TOKEN = "4cfbfe8573ecf61c3670455f98b040c9da49444d98c857ff2f7ba776434d3fdc";

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
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(TOKEN_LABEL));
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

type Copy = { title: string; intro: string; label: string; button: string; error: string; show: string; hide: string };

const COPY: Record<"en" | "es", Copy> = {
  en: {
    title: "Private résumé",
    intro: "This résumé is shared by invitation. Enter the password to view it.",
    label: "Password",
    button: "Unlock résumé",
    error: "Wrong password. Please try again.",
    show: "Show password",
    hide: "Hide password",
  },
  es: {
    title: "CV privado",
    intro: "Este CV se comparte por invitación. Escribe la clave para verlo.",
    label: "Clave",
    button: "Desbloquear CV",
    error: "Clave incorrecta. Inténtalo de nuevo.",
    show: "Mostrar clave",
    hide: "Ocultar clave",
  },
};

function pickLanguage(request: NextRequest): "en" | "es" {
  const cookie = request.cookies.get("language")?.value;
  if (cookie === "en" || cookie === "es") return cookie;
  return /^es\b/i.test(request.headers.get("accept-language") ?? "") ? "es" : "en";
}

/** Decorative, data-free résumé silhouette shown blurred behind the modal. */
const SILHOUETTE = `
  <div class="sheet" aria-hidden="true">
    <div class="bar w40 center tall"></div>
    <div class="bar w60 center"></div>
    <hr>
    <div class="bar w25 heading"></div>
    <div class="bar w100"></div><div class="bar w95"></div><div class="bar w80"></div>
    <hr>
    <div class="bar w25 heading"></div>
    <div class="chips">${'<span></span>'.repeat(14)}</div>
    <hr>
    <div class="bar w35 heading"></div>
    <div class="bar w50"></div><div class="bar w90"></div><div class="bar w85"></div><div class="bar w70"></div>
    <div class="bar w50 gap"></div><div class="bar w90"></div><div class="bar w75"></div>
    <hr>
    <div class="bar w25 heading"></div>
    <div class="bar w60"></div><div class="bar w45"></div>
  </div>`;

function loginPage(request: NextRequest, next: string, failed: boolean) {
  const lang = pickLanguage(request);
  const t = COPY[lang];

  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="light dark">
<title>Roberto Gallardo · ${t.title}</title>
<style>
  :root {
    --bg1:#eef2ff; --bg2:#f8fafc; --sheet:#ffffff; --ink:#cbd5e1; --ink-strong:#94a3b8;
    --glass:rgb(255 255 255 / .72); --border:rgb(255 255 255 / .9); --fg:#0f172a; --muted:#475569;
    --field:rgb(255 255 255 / .9); --field-border:#cbd5e1; --primary:#6d28d9; --primary2:#0ea5e9;
    --danger:#dc2626; --shadow:0 30px 80px -20px rgb(15 23 42 / .35);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg1:#0b1020; --bg2:#050509; --sheet:#151521; --ink:#262637; --ink-strong:#34344a;
      --glass:rgb(23 23 35 / .66); --border:rgb(255 255 255 / .08); --fg:#f1f5f9; --muted:#a1a1b5;
      --field:rgb(10 10 18 / .7); --field-border:#33334a; --primary:#8b5cf6; --primary2:#38bdf8;
      --danger:#f87171; --shadow:0 30px 80px -20px rgb(0 0 0 / .8);
    }
  }
  * { box-sizing:border-box; }
  html, body { height:100%; }
  body {
    margin:0; overflow:hidden; color:var(--fg);
    font:16px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background:radial-gradient(1200px 600px at 10% -10%, rgb(109 40 217 / .25), transparent 60%),
               radial-gradient(900px 500px at 110% 110%, rgb(14 165 233 / .22), transparent 60%),
               linear-gradient(180deg, var(--bg1), var(--bg2));
  }

  /* Blurred résumé silhouette (no real data) */
  .stage { position:fixed; inset:0; display:grid; place-items:center; padding:24px; }
  .sheet {
    width:min(720px, 92vw); height:min(1000px, 140vh); background:var(--sheet); border-radius:18px;
    padding:56px 48px; box-shadow:0 20px 60px rgb(0 0 0 / .12);
    filter:blur(9px) saturate(1.1); transform:scale(1.04); opacity:.9;
  }
  .bar { height:12px; border-radius:6px; background:var(--ink); margin:12px 0; }
  .bar.tall { height:30px; background:var(--ink-strong); }
  .bar.heading { height:16px; background:var(--ink-strong); margin-top:4px; }
  .bar.center { margin-left:auto; margin-right:auto; }
  .bar.gap { margin-top:24px; }
  .w25{width:25%} .w35{width:35%} .w40{width:40%} .w45{width:45%} .w50{width:50%} .w60{width:60%}
  .w70{width:70%} .w75{width:75%} .w80{width:80%} .w85{width:85%} .w90{width:90%} .w95{width:95%} .w100{width:100%}
  .chips { display:flex; flex-wrap:wrap; gap:8px; margin:12px 0; }
  .chips span { width:84px; height:24px; border-radius:999px; background:var(--ink); }
  .chips span:nth-child(3n) { width:120px; } .chips span:nth-child(4n) { width:64px; }
  hr { border:0; height:1px; background:var(--ink); margin:28px 0; }
  .veil { position:fixed; inset:0; backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
          background:rgb(15 23 42 / .18); }

  /* Modal */
  .modal-wrap { position:fixed; inset:0; display:grid; place-items:center; padding:16px; }
  .modal {
    width:100%; max-width:400px; padding:36px 32px 28px; border-radius:24px;
    background:var(--glass); border:1px solid var(--border); box-shadow:var(--shadow);
    backdrop-filter:blur(22px) saturate(1.4); -webkit-backdrop-filter:blur(22px) saturate(1.4);
    animation:pop .45s cubic-bezier(.2,.9,.3,1.2) both;
  }
  .modal.shake { animation:pop .45s cubic-bezier(.2,.9,.3,1.2) both, shake .45s .1s both; }
  @keyframes pop { from { opacity:0; transform:translateY(14px) scale(.96); } to { opacity:1; transform:none; } }
  @keyframes shake { 20%,60% { transform:translateX(-7px); } 40%,80% { transform:translateX(7px); } }
  .lock {
    width:60px; height:60px; border-radius:18px; display:grid; place-items:center; margin:0 auto 18px;
    color:#fff; background:linear-gradient(135deg, var(--primary), var(--primary2));
    box-shadow:0 12px 30px -8px rgb(109 40 217 / .6);
  }
  h1 { margin:0 0 6px; font-size:1.45rem; text-align:center; letter-spacing:-.01em; }
  .who { text-align:center; font-size:.85rem; color:var(--muted); margin:0 0 4px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; }
  .intro { margin:0 0 24px; text-align:center; color:var(--muted); font-size:.95rem; }
  label { display:block; font-size:.82rem; font-weight:600; margin:0 0 8px; color:var(--muted); }
  .field { position:relative; }
  input[type=password], input[type=text] {
    width:100%; padding:13px 46px 13px 14px; border-radius:14px; border:1px solid var(--field-border);
    background:var(--field); color:var(--fg); font-size:1rem; transition:border-color .2s, box-shadow .2s;
  }
  input:focus { outline:none; border-color:var(--primary); box-shadow:0 0 0 4px rgb(109 40 217 / .18); }
  .toggle {
    position:absolute; right:6px; top:50%; transform:translateY(-50%); width:36px; height:36px;
    border:0; border-radius:10px; background:transparent; color:var(--muted); cursor:pointer;
    display:grid; place-items:center;
  }
  .toggle:hover { color:var(--fg); }
  .submit {
    width:100%; margin-top:16px; padding:13px; border:0; border-radius:14px; cursor:pointer;
    color:#fff; font-weight:700; font-size:1rem; letter-spacing:.01em;
    background:linear-gradient(135deg, var(--primary), var(--primary2));
    box-shadow:0 12px 28px -10px rgb(109 40 217 / .7); transition:transform .15s, filter .2s;
  }
  .submit:hover { filter:brightness(1.08); } .submit:active { transform:scale(.98); }
  .error { display:flex; gap:8px; align-items:center; margin:0 0 14px; padding:10px 12px; border-radius:12px;
           color:var(--danger); background:rgb(220 38 38 / .08); font-size:.9rem; }
  footer { margin-top:22px; text-align:center; font-size:.8rem; color:var(--muted); }
  footer a { color:inherit; text-decoration:none; border-bottom:1px dashed currentColor; }
  @media (prefers-reduced-motion: reduce) { .modal, .modal.shake { animation:none; } }
</style>
</head>
<body>
  <div class="stage">${SILHOUETTE}</div>
  <div class="veil"></div>
  <div class="modal-wrap">
    <main class="modal${failed ? " shake" : ""}" role="dialog" aria-modal="true" aria-labelledby="title">
      <div class="lock" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
      </div>
      <p class="who">Roberto Gallardo</p>
      <h1 id="title">${t.title}</h1>
      <p class="intro">${t.intro}</p>
      ${failed ? `<p class="error" role="alert">${t.error}</p>` : ""}
      <form method="post" action="${LOGIN_PATH}">
        <input type="hidden" name="next" value="${escapeHtml(next)}">
        <label for="password">${t.label}</label>
        <div class="field">
          <input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
          <button class="toggle" type="button" aria-label="${t.show}" data-show="${t.show}" data-hide="${t.hide}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
        <button class="submit" type="submit">${t.button}</button>
      </form>
      <footer><a href="https://robertogallardo.dev">robertogallardo.dev</a></footer>
    </main>
  </div>
  <script>
    (function () {
      var btn = document.querySelector(".toggle"), input = document.getElementById("password");
      btn.addEventListener("click", function () {
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.setAttribute("aria-label", show ? btn.dataset.hide : btn.dataset.show);
        input.focus();
      });
    })();
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 401,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const password = process.env.CV_PASSWORD;
  const expected = password ? await accessToken(password) : DEFAULT_TOKEN;

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
    return loginPage(request, next, true);
  }

  if (safeEqual(request.cookies.get(COOKIE_NAME)?.value ?? "", expected)) {
    return NextResponse.next();
  }

  const wantsHtml = (request.headers.get("accept") ?? "").includes("text/html");
  if (wantsHtml) {
    const next = pathname === LOGIN_PATH ? "/" : safeNext(pathname + search);
    return loginPage(request, next, false);
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
