# Pancham Khaitan

Static personal website built with Next.js and hosted on Cloudflare Pages.

## Local development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Static build

```bash
npm run build
npm run verify:static
```

The build writes the complete site to `out/`. There is no Next.js server in production. Search is generated as `/search-index.json`; the only server-side route is the Cloudflare Pages contact function in `functions/api/contact.ts`.

## Cloudflare Pages

The Pages project uses:

- Build command: `npm run build`
- Output directory: `out`
- Build variable: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- Secrets: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, and optionally `PROFESSIONAL_EMAIL`

Preview the exact Pages output locally with `npm run preview:cloudflare`. Deploy it with `npm run deploy:cloudflare` after authenticating Wrangler.

## Links

1. X / Twitter ([@PanchamKhaitan](https://twitter.com/PanchamKhaitan))
2. LinkedIn ([Pancham Khaitan](https://linkedin.com/in/panchamkhaitan))
