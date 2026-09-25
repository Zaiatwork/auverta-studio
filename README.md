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

## Project structure

```
app/            layout (fonts, metadata, theme boot script), page, global styles
components/     one component per section, plus Navigation, CustomCursor, SmoothScroll, ThemeToggle
lib/content.ts  all site copy in one place
lib/gsap.ts     shared GSAP setup and breakpoints
lib/scroll.ts   Lenis instance and in-page scrolling
public/         brand logo and imagery from auverta.studio
```

## Content notes

- All copy and imagery come from the live site. No clients, results, statistics or testimonials are invented; add real ones in `lib/content.ts` when available.
- The contact email is a placeholder (`info@auverta.studio`) until the correct inbox is confirmed.
- The contact form has no backend yet. It opens the visitor's email app with the brief pre-filled.

## Deploying

Previews are deployed from a machine that has the fonts, using the Vercel CLI (`npx vercel`). `.vercelignore` makes sure the font files are uploaded even though git ignores them. A Vercel project connected directly to this GitHub repo would fail to build, because the repo has no font files.
