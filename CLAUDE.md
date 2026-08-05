# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start Next.js development server
npm run dev

# Build for production
npm run build

# Preview the exported site with Cloudflare Pages locally
npm run preview:cloudflare

# Deploy to the configured Cloudflare Pages project (requires Wrangler authentication)
npm run deploy:cloudflare

# Verify that the export contains no Next.js server routes
npm run verify:static

# Lint
npm run lint
npm run lint:fix       # Auto-fix linting issues

# Format code with Prettier
npm run format
npm run format:check
```

## Architecture Overview

This is a static personal portfolio built with **Next.js 15.5.18 App Router** and **React 19.1.0**, exported to `out/` and hosted on Cloudflare Pages. Content is file-based markdown with frontmatter.

### Core Architecture

**Content Management:**

- Content lives in `content/` directory as markdown files with YAML frontmatter
- Four content types: `blog/`, `work/`, `notes/`, `updates/`
- Content is loaded server-side using `src/lib/content-loader.ts` which recursively scans directories
- Server queries in `src/lib/server-queries.ts` transform markdown to typed data structures

**Data Flow:**

1. Markdown files → `content-loader.ts` (gray-matter parsing) → `server-queries.ts` (normalization) → Page components
2. No database or Next.js server runs in production; content is read during the static build

**Email System:**

- The static contact page posts to the Cloudflare Pages Function at `functions/api/contact.ts`
- The function verifies Cloudflare Turnstile and calls the Resend REST API
- It sends an owner notification; the visitor's address is used only for replies

**Search:**

- `src/app/search-index.json/route.ts` generates a static index at build time
- `CommandPalette` downloads that JSON and filters it in the browser (Cmd+K / Ctrl+K)

### Key Pages & Routes

```
/                    - Homepage with featured work carousel
/work                - Portfolio items grid
/work/[slug]         - Individual portfolio detail page
/blog                - Blog posts listing
/blog/[slug]         - Individual blog post
/blog/tags/[tag]     - Blog posts filtered by tag
/notes               - Notes listing
/notes/[slug]        - Individual note (or redirect if external)
/updates             - Timeline of updates
/about               - About page
/contact             - Contact form
```

### Component Architecture

**Layouts:**

- `MinimalLayout` (default) - Used by root layout, provides Header/Footer
- Components split between:
    - `MinimalHeader` / `MinimalFooter` - Simple nav components
    - `Header` / `Footer` - Alternative styling options

**Key Interactive Components:**

- `CommandPalette.tsx` - Cmd+K search palette, filters `/search-index.json` locally
- `ThemeToggle.tsx` - Light/dark mode switcher with localStorage persistence
- `Carousel.tsx` - Featured work carousel on homepage using react-multi-carousel
- `ClientOverlays.tsx` - Wraps CommandPalette and other client-side overlays

**UI Library:**

- Mix of custom components in `src/components/` and shadcn/ui in `src/components/ui/`
- Tailwind CSS 4.0 beta with custom theme (accent colors: `#1f1f1f`, `#0a0a0a`, `#6f6f6f`)
- Geist font family (Sans + Mono) from Vercel

### Type System

Type definitions in `src/types/`:

- `blog.ts` - Blog post structure
- `work.ts` - Portfolio work structure
- `note.ts` - Note structure
- `update.ts` - Update/timeline entry structure

### Important Configuration

**Build Configuration (`next.config.js`):**

- `output: "export"` emits static files into `out/`
- Next Image optimization is disabled because Cloudflare serves the exported assets directly
- Remote images are restricted to the hostnames listed in `next.config.js`

**Content Frontmatter Format:**

Blog posts require:

```yaml
title: string
description: string
tags: string[]
createdAt: date string
updatedAt: date string (optional)
```

Work items require:

```yaml
title: string
shortDescription: string
startDate: date string
endDate: string | null
heroImage: url
heroImageAlt: string
isFeatured: boolean
isHidden: boolean
createdAt: date string
```

Notes require:

```yaml
title: string
excerpt: string
isExternal: boolean (optional)
externalUrl: string | null
createdAt: date string
```

Updates require:

```yaml
title: string
snippet: string
linkUrl: string (optional)
linkLabel: string (optional)
kind: string (e.g., "photography", "work", "blog")
createdAt: date string
```

### Styling Approach

- Tailwind CSS with dark mode via `class` strategy (manual toggle, not system-based)
- Theme initialization script in root layout prevents flash on load
- Custom SCSS modules coexist with Tailwind for legacy components
- Font: Geist Sans + Geist Mono variable fonts

### Environment Variables

Required for full functionality:

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY      # Required at build time
RESEND_API_KEY                      # Cloudflare Pages secret
TURNSTILE_SECRET_KEY                # Cloudflare Pages secret
PROFESSIONAL_EMAIL                  # Optional Pages secret; defaults to hello@
```

### Development Notes

- Production has no Next.js process. Run `npm run build` and deploy `out/`.
- Content and search changes appear after a new build and deployment.
- `public/_headers` defines the production security and cache headers.
- Next.js telemetry is disabled in the development and build scripts.
- Images should be hosted externally (typically S3) and referenced via URL in frontmatter
- Dark mode state persists in localStorage with inline script preventing flash
