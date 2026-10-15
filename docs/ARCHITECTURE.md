# Architecture

Auverta is a **static Next.js export** (`out/`) served by Apache on Hostinger shared hosting, plus a small **PHP + MySQL API** for the contact form. There is no Node server in production.

## Folder map

```
app/                    Routes only: layouts, pages, metadata, error boundaries
  (site)/               Inner pages (about, services, work, process, contact, legal), wrapped in SiteShell
  page.tsx              Home; composes the same SiteShell plus the 3D backdrop
  error.tsx             Route-level error boundary (retry + home link)
  global-error.tsx      Fallback when the root layout itself fails
components/
  layout/               Page chrome: SiteShell, Navigation, Footer, SmoothScroll, CustomCursor, PageTransition, ThemeToggle
  sections/             Page sections: Hero, Services, Work, Process, Contact, PageHero, CtaBand ...
  ui/                   Small reusable pieces: BrandMark, Reveal, JsonLd
  three/                React Three Fiber scene (loaded client-side only)
hooks/                  Stateful logic extracted from components (useContactForm, useNavScroll)
lib/
  config/env.ts         The only file that reads environment variables
  api/                  Typed API client (client.ts) and one module per endpoint (contact.ts)
  content.ts, pages.ts  All copy and page data (no JSX)
  gsap.ts, scroll.ts    Motion setup, breakpoints, Lenis handle
  theme.ts              Theme key, toggle, and the pre-paint boot script
  journey.ts            Pure maths for the travelling 3D mark (unit-tested)
public/
  api/                  PHP endpoints (+ _lib.php shared helpers)
  .htaccess             HTTPS, security headers, CSP, denied file patterns
  .auverta/             Deny-all folder that holds the server-only config.php
backend/                config.example.php and schema.sql (never deployed as-is)
scripts/                flatten-prefetch.mjs (post-build), shots.mjs (screenshots)
docs/                   This file
```

## Layering rules

1. **Pages** (`app/`) fetch nothing and hold no logic: they pick data from `lib/` and compose components.
2. **Components** render. If one needs state beyond a toggle, or talks to the network, that goes in a hook in `hooks/`.
3. **Hooks** own UI state and call `lib/api/*`. They never build URLs or read `process.env`.
4. **`lib/`** has no React (except `gsap.ts` hooks re-export). It is the unit-testable layer.
5. Import with the `@/` alias, never `../`. Component files use default exports, `lib/` and `hooks/` use named exports.

## State management

There is no global store because there is no shared mutable state. State lives where it is used:

| State | Where | How |
| --- | --- | --- |
| Contact form status | `hooks/useContactForm` | `useReducer` state machine: idle → sending → sent / error |
| Nav scrolled / hidden | `hooks/useNavScroll` | scroll listener batched through `requestAnimationFrame` |
| Mobile menu open | `Navigation` | local `useState` |
| Theme | `<html data-theme>` + `localStorage` | `lib/theme.ts`; CSS reads the attribute, so no React state or context is needed |
| Smooth-scroll instance | `lib/scroll.ts` | module singleton set by `SmoothScroll` |

If cross-component state appears later (cart, auth), add a context in `hooks/` rather than a library.

## Configuration and environments

| Concern | Where | Notes |
| --- | --- | --- |
| Public build-time values | `.env.local` (see `.env.example`), read only in `lib/config/env.ts` | Inlined at build; changing them needs a rebuild |
| Server secrets (DB, mail, salt) | `public_html/.auverta/config.php` on the server | Copy from `backend/config.example.php`; never committed, never in `.env*` |
| Brand fonts | `app/fonts/` | Commercial, git-ignored (see README) |

Defaults in `env.ts` are the production values, so a plain `npm run build` produces the production site.

## API

Endpoints are PHP files in `public/api/`. Every response is JSON: `{ "ok": true, ... }` or `{ "ok": false, "error": "message" }` with a matching HTTP status.

**Client side**

- `lib/api/client.ts`: `apiPost()` adds the base URL, a 15 s timeout and JSON handling, and throws a single `ApiError` (`status`, `fromServer`). `fromServer` is true only when the server sent a message safe to show visitors.
- `lib/api/<endpoint>.ts`: one small typed function per endpoint (`sendContact`).

**Server side**

- `public/api/_lib.php`: `api_boot()` (POST only, config, same-origin check, JSON body), `clean()`, `db()`, `ip_hash()`, `rate_limit()`, `respond()`. Files starting with `_` are denied over HTTP by `.htaccess`.
- `public/api/contact.php`: validates, rate limits (5/hour/visitor), stores in `leads`, emails `mail_to`.

**Adding an endpoint** (for example `newsletter`)

1. `public/api/newsletter.php`: `require __DIR__ . '/_lib.php'; [$cfg, $in] = api_boot();` then validate, act, `respond(200, ['ok' => true])`.
2. `lib/api/newsletter.ts`: export `sendNewsletter = (p: NewsletterPayload) => apiPost('/api/newsletter.php', p)`.
3. A hook in `hooks/` if the UI needs loading/error state; copy the shape of `useContactForm`.
4. Add a table to `backend/schema.sql` if it stores data.

## Error handling

- **Network/API**: `apiPost` converts every failure (offline, timeout, non-JSON, non-2xx) into `ApiError`; hooks turn it into a visitor-facing message and always point to the contact email as a fallback.
- **Rendering**: `app/error.tsx` (per route) and `app/global-error.tsx` (root) catch crashes; `app/not-found.tsx` handles unknown URLs.
- **Browser APIs**: storage access is wrapped in try/catch (private mode); motion is skipped under `prefers-reduced-motion`.
- **PHP**: validation errors return 4xx with a safe message; unexpected errors are logged with `error_log` and return a generic 500. Internals are never sent to the browser.

## Build and deploy

`npm run build` runs `next build` (static export to `out/`) then `scripts/flatten-prefetch.mjs`. Upload `out/` to `public_html/`. `public/` is copied into `out/` by Next, which is how `api/`, `.htaccess` and `.auverta/` reach the server.

## Tests

`npm test` runs Vitest. Covered: the API client's error paths and the journey maths. Add a test beside any new `lib/` module.
