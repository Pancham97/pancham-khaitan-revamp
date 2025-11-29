# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start Next.js development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
npm run lint:fix       # Auto-fix linting issues

# Format code with Prettier
npm run format
npm run format:check
```

## Architecture Overview

This is a personal portfolio website built with **Next.js 15.4.1 App Router** and **React 19.1.0**. The architecture has evolved from a MongoDB-backed GraphQL API to a **file-based content system** using markdown files with frontmatter.

### Core Architecture

**Content Management:**

- Content lives in `content/` directory as markdown files with YAML frontmatter
- Four content types: `blog/`, `work/`, `notes/`, `updates/`
- Content is loaded server-side using `src/lib/content-loader.ts` which recursively scans directories
- Server queries in `src/lib/server-queries.ts` transform markdown to typed data structures

**Data Flow:**

1. Markdown files → `content-loader.ts` (gray-matter parsing) → `server-queries.ts` (normalization) → Page components
2. No database queries at runtime - all content is read from filesystem during SSR/SSG

**Email System:**

- Uses Resend API via `src/lib/resend.ts`
- Two email types: contact forms (`/api/contact`) and newsletter subscriptions (`/api/subscribe`)
- Sends dual emails: user confirmation + owner notification

**Search:**

- Full-text search API at `/api/search` searches across all content types
- Integrated into CommandPalette component (Cmd+K / Ctrl+K)

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

- `CommandPalette.tsx` - Cmd+K search palette, searches via `/api/search`
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

- `ignoreBuildErrors: true` and `ignoreDuringBuilds: true` - TypeScript/ESLint errors don't fail builds
- Remote images allowed from all HTTPS domains

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

Required for full functionality (see `sample-env.yml` if it exists):

```
RESEND_API_KEY                      # For email via Resend
PROFESSIONAL_EMAIL                  # Owner email for contact forms
NEXT_PUBLIC_TURNSTILE_SITE_KEY     # Cloudflare Turnstile site key (client-side)
TURNSTILE_SECRET_KEY                # Cloudflare Turnstile secret key (server-side)
```

### Development Notes

- Content changes require dev server restart to see updates (no hot reload for markdown)
- Search indexing happens on each API request (no pre-built index)
- Images should be hosted externally (typically S3) and referenced via URL in frontmatter
- Dark mode state persists in localStorage with inline script preventing flash
