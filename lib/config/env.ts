// The only place environment variables are read. Everything else imports from here.
// NEXT_PUBLIC_* values are inlined at build time (the site is a static export), so
// change them in .env.local and rebuild. Defaults are the production values.
// Next only inlines literal `process.env.NEXT_PUBLIC_X` reads, so no dynamic lookups here.

const trimSlash = (s: string) => s.replace(/\/+$/, '')

/** Canonical origin, no trailing slash. Used for metadata, sitemap, robots and JSON-LD. */
export const SITE_URL = trimSlash(process.env.NEXT_PUBLIC_SITE_URL || 'https://auverta.studio')

/** Public inbox shown on the site and in structured data. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@auverta.studio'

/** Prefix for the PHP endpoints. Empty means same-origin (`/api/...`). */
export const API_BASE_URL = trimSlash(process.env.NEXT_PUBLIC_API_BASE_URL || '')
