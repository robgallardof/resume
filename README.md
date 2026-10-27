<a id="top"></a>

<h1 align="center">Roberto Gallardo — Résumé</h1>

<p align="center">One bilingual résumé for the web and PDF. Access is private; the development guide explains how to work on it locally.</p>

Bilingual (EN/ES) résumé built with Next.js 16, React 19 and Tailwind CSS 4, deployed on Vercel at
`cv.robertogallardo.dev`.

- **Web:** a printable sheet with a header, a sidebar (contact, skills, languages, education) and a main column
  (profile, experience timeline, open-source projects, certifications).
- **PDF:** the download button builds a real A4 PDF with `@react-pdf/renderer` — selectable text, clickable links,
  page numbers and metadata — from the same data as the web page.

## Private access

The whole site — pages and JavaScript chunks — is behind a password checked on the server by `proxy.ts`.
Visitors see a modal over a blurred, data-free résumé silhouette; nothing of the real résumé loads before login.

- The default password is stored in `proxy.ts` only as an HMAC token, never in plain text.
- To use a different password, set `CV_PASSWORD` in **Vercel → Project → Settings → Environment Variables** and
  redeploy; it overrides the default.
- Access lasts 30 days per browser (HttpOnly cookie). Changing the password signs everybody out.
- Visiting `/__logout` signs the current browser out.
- Keep this repository **private**: the résumé content lives in `app/i18n/locales/*.json`.

## Development

```sh
pnpm install
pnpm dev                      # uses the default password; CV_PASSWORD overrides it
pnpm lint
pnpm build
```

Content lives in `app/i18n/locales/en.json` and `es.json`; `lib/resume.ts` turns it into the typed model that both
the web view (`components/resume/ResumeView.tsx`) and the PDF (`components/pdf/ResumeDocument.tsx`) render.

## Tests

`pnpm test` runs Vitest:

| Suite | Covers |
|---|---|
| `tests/unit/access.test.ts` | Token derivation, constant-time compare, open-redirect protection, HTML escaping, language pick |
| `tests/unit/resume.test.ts` | EN/ES content parity, contact data, completed master's, https links, no dead domains, PDF-safe text |
| `tests/integration/proxy.test.ts` | The password gate end to end: blocked pages and chunks, login, cookie flags, revocation, logout |
| `tests/integration/resume-view.test.tsx` | The web résumé renders every section, job and link in both languages |
| `tests/integration/pdf.test.tsx` | A real A4 PDF with vector text and links, exactly two pages, descriptive file name |

CI (`.github/workflows/ci.yml`) runs lint, tests and build on every push and pull request.

<p align="center"><a href="#top">Back to top</a></p>

<!-- readme-builder:signature:start -->
<p align="center"><a href="https://github.com/robgallardof"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/brand/signature-en-dark.svg" /><img src="assets/readme/brand/signature-en-light.svg" alt="Roberto Gallardo / Résumé / Roberto Gallardo" width="360" /></picture></a></p>
<!-- readme-builder:signature:end -->
