# Auverta: website prototype

A Next.js prototype for a redesign of [auverta.studio](https://auverta.studio), the creative technology and digital growth studio. It is separate from the live WordPress site.

**Strategy × Design × Technology × AI × Growth**

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- GSAP + ScrollTrigger for motion, Lenis for smooth scrolling
- three.js / React Three Fiber for the 3D Auverta mark in the hero
- Light theme by default, dark theme via the toggle in the navigation

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Brand fonts (required, not included)

The site uses Auverta's own typefaces: **GHIGA** (display headlines) and **Grift** (text). They are commercial fonts, so the files are not part of this repository. Before running or building, place these files in `app/fonts/`:

```
GHIGA.otf
Grift-Light.ttf
Grift-Regular.ttf
Grift-Italic.ttf
Grift-Medium.ttf
Grift-SemiBold.ttf
Grift-Bold.ttf
```

Without them, `next dev` and `next build` fail with a "font file not found" error.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Static export to `out/` |
| `npm run lint` / `npm test` | ESLint / Vitest |

## Project structure

```
app/          routes, layouts, error boundaries
components/   layout/ (page chrome), sections/, ui/ (reusables), three/ (3D)
hooks/        stateful logic (contact form, nav scroll)
lib/          config/env.ts, api/ (typed client), content, motion, theme
public/       static assets, PHP endpoints in api/, .htaccess
backend/      PHP config template and SQL schema
docs/         ARCHITECTURE.md
```

Layering rules, state management, the API structure and how to add an endpoint are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Configuration

Copy `.env.example` to `.env.local` to override the public build-time values (site URL, contact email, API base). Defaults are production, so nothing is required. Server secrets (database, mail) never go in `.env*`; they live in `public_html/.auverta/config.php` on the server, created from `backend/config.example.php`.

## Content notes

- All copy and imagery come from the live site. No clients, results, statistics or testimonials are invented; add real ones in `lib/content.ts` when available.
- The contact form posts to `public/api/contact.php`, which stores the lead in MySQL (`backend/schema.sql`) and emails it.

## Deploying

The site is deployed to Hostinger shared hosting as static files: run `npm run build` on a machine that has the fonts, upload the contents of `out/` to `public_html/`, and create `.auverta/config.php` on the server.
