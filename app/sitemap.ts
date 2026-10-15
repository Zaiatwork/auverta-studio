import type { MetadataRoute } from 'next'
import { CASE_PAGES, SERVICE_PAGES } from '@/lib/pages'
import { SITE_URL } from '@/lib/config/env'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/services/',
    '/work/',
    '/about/',
    '/process/',
    '/contact/',
    ...SERVICE_PAGES.map((s) => `/services/${s.slug}/`),
    ...CASE_PAGES.map((c) => `/work/${c.slug}/`),
    '/privacy/',
    '/terms/',
  ]
  return paths.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'monthly', priority: p === '/' ? 1 : 0.7 }))
}
