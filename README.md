# Roberto Gallardo — Résumé

Bilingual (EN/ES) résumé built with Next.js 16, React 19 and Tailwind CSS 4, deployed on Vercel at
`cv.robertogallardo.dev`. It can be downloaded as a PDF from the page.

## Private access

The whole site — pages and JavaScript chunks — is behind a password checked on the server by `proxy.ts`.

| Variable | Required | Purpose |
|---|---|---|
| `CV_PASSWORD` | yes | Password visitors type to open the résumé. Without it the site stays locked. |

- Set it in **Vercel → Project → Settings → Environment Variables** (Production and Preview), then redeploy.
- Access lasts 30 days per browser (HttpOnly cookie). Changing `CV_PASSWORD` signs everybody out.
- Visiting `/__logout` signs the current browser out.
- Keep this repository **private**: the résumé content lives in `app/i18n/locales/*.json`.

## Development

```sh
pnpm install
CV_PASSWORD=dev pnpm dev      # PowerShell: $env:CV_PASSWORD="dev"; pnpm dev
pnpm lint
pnpm build
```

Content lives in `app/i18n/locales/en.json` and `es.json`.
