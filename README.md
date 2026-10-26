# Roberto Gallardo — Résumé

Bilingual (EN/ES) résumé built with Next.js 16, React 19 and Tailwind CSS 4, deployed on Vercel at
`cv.robertogallardo.dev`. It can be downloaded as a PDF from the page.

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

Content lives in `app/i18n/locales/en.json` and `es.json`.
