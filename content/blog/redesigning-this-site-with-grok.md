---
title: "Redesigning this site with Grok as pair programmer"
description: "How I rebuilt panchamkhaitan.com as a modern-minimal personal site — photo, short prose, full posts in the feed — with Grok accelerating the work and human taste calling the shots."
tags:
    - design
    - engineering
    - personal
createdAt: "2026-07-17"
updatedAt: "2026-07-26"
---

I rebuilt this site to show **as much as necessary, not as much as possible**. The home page is a photo, a short paragraph, and links in the prose. No hero theater, no featured-work carousel, no proof grids on the front door.

Grok (via the agent tooling I already live in) was the pair programmer. I directed taste, structure, and what stayed. The model accelerated layout plumbing, content wiring, and iteration speed.

## Before / after

**Before** was a conventional personal portfolio: top nav, big hero, carousel energy, work cards with stock-ish photography, newsletter footer. Captured from the [Internet Archive](https://web.archive.org/web/20250620011827/https://panchamkhaitan.com/) (June 2025).

![Homepage before redesign — white portfolio with hero, carousel dots, and work cards](/blog/redesign/before-desktop.webp)

An intermediate step went toward a warm “dossier” look — mono type, copper accent, longer home with sections. That was calmer than the portfolio, but still did too much on the first screen.

**After** is modern minimal: name, portrait on the left, prose on the right. Projects like Steno show up in a sentence, not a card wall. Work, blog, notes, about, and contact are one link away — often inside the paragraph itself.

![Homepage after redesign — quiet layout with portrait and short prose](/blog/redesign/after-desktop.webp)

Mobile after (same home, narrow viewport):

![Mobile homepage after redesign](/blog/redesign/after-mobile.webp)

Full before page (hero through work cards and footer), if you want the long scroll:

![Full homepage before redesign including My Work card grid and dark footer](/blog/redesign/before-desktop-full.webp)

## What the site is for

It is not here to impress. It is here so someone can:

- see who I am in a few seconds
- open **work**, **writing**, **notes**, or **about** without hunting chrome
- leave via contact if they want to talk

Primary nav stays short: Work · Blog · Notes · About · Contact. Projects, gear, and now still exist — Cmd+K and in-page links are enough for those.

## What changed under the hood

**Before (IA / system):**

- Heavier UI patterns — carousel, card grids, multi-section home
- Content had lived through a Mongo/GraphQL era; the site still felt “app-like”

**After:**

- File-based content (`content/blog`, `content/work`, notes, updates) loaded at build time
- One quiet reading measure, Source Serif, restrained accent
- Career-first `/work`, side projects on `/projects`, an honest `/now`
- Real `/notes` listing (study notes), not buried only under About
- Cmd+K search across pages and posts
- Dark mode without fighting the page
- A prebuilt OG image and search index
- RSS with **full post bodies** for local writing (`content:encoded`)

The homepage stays intentionally short on purpose.

## What Grok was good at

- Turning a fuzzy “ultra minimal, modern, necessary only” brief into concrete structure
- Scaffolding Next.js App Router pages and keeping components thin
- Iterating copy until it sounded like me instead of brochure-speak
- Mechanical work: sitemap, robots, contact hardening, feed full-text, image paths, markdown case studies

## What I still had to own

Models will happily invent polish you did not ask for, or leave assets that would embarrass you under a traffic spike.

I had to:

- Cut the home back again after a “nice” intermediate redesign still felt busy
- Compress multi‑MB gear photos nobody needed at full resolution
- Flesh out Helios and Aura case studies so they were not thinner than old freelance pages
- Keep repeated “clever” lines from showing up on every page
- Decide what _not_ to ship (Instagram embeds that break, default Next 404s, public template SVGs)
- Hunt real before screenshots (Wayback) instead of inventing a fake past

That is the honest split: **Grok accelerated the redesign; I owned the bar.**

## Stack, briefly

- Next.js App Router + React 19
- Markdown + YAML frontmatter (no runtime DB)
- Tailwind 4 tokens for a quiet paper / ink system
- Resend + Cloudflare Turnstile for contact
- Statically hosted on Cloudflare Pages

## If you are building with agents too

1. Give the model a strong constraint (photo + paragraph, no card grid, no show-off home).
2. Put content in boring files so either of you can edit without ceremony.
3. Measure the embarrassing stuff: image weight, empty states, forms under spam, feed completeness.
4. Write down what the model did vs what you decided — readers can smell pure hype.
5. Keep a before capture (or use the Archive) _before_ you ship the redesign.
6. Prefer **necessary** over **impressive**. The second redesign is often the honest one.

If you want the source or to argue about how quiet a personal site should be, [say hi](/contact).
