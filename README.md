# bp578.github.io

Personal portfolio built with Next.js (App Router), React, TypeScript, and Tailwind CSS, statically exported to GitHub Pages.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in ./out
```

## Structure

- `src/data/site.ts`: name, headline, and social links (edit content here)
- `src/components/`: one component per section (`Hero`, `SocialLinks`, ...)
- `src/app/page.tsx`: puts the sections together
- `src/app/globals.css`: Tailwind theme (navy palette, font)

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `./out`.
One-time setup: **Settings → Pages → Source: GitHub Actions**.
