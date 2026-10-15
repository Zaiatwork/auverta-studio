import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageHero from '@/components/sections/PageHero'
import Reveal from '@/components/ui/Reveal'
import CtaBand from '@/components/sections/CtaBand'
import { CASE_PAGES, SERVICE_PAGES } from '@/lib/pages'

export const dynamicParams = false

export function generateStaticParams() {
  return CASE_PAGES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const c = CASE_PAGES.find((x) => x.slug === slug)
  if (!c) return {}
  return {
    title: `${c.title} | Auverta`,
    description: c.description,
    alternates: { canonical: `/work/${c.slug}/` },
    openGraph: { images: [{ url: c.image.src, width: c.image.width, height: c.image.height, alt: c.image.alt }] },
  }
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const idx = CASE_PAGES.findIndex((x) => x.slug === slug)
  if (idx === -1) notFound()
  const c = CASE_PAGES[idx]
  const next = CASE_PAGES[(idx + 1) % CASE_PAGES.length]
  const related = SERVICE_PAGES.find((s) => s.number === c.id)

  return (
    <Reveal>
      <PageHero
        eyebrow={`${c.id} / ${c.discipline}`}
        title={c.title}
        lead={c.description}
        crumbs={[
          { label: 'Work', href: '/work/' },
          { label: c.title, href: `/work/${c.slug}/` },
        ]}
      />

      <div className="container">
        <div className="feature-image" data-parallax data-reveal>
          <Image src={c.image.src} alt={c.image.alt} width={c.image.width} height={c.image.height} sizes="(max-width: 1440px) 92vw, 1300px" priority />
        </div>
      </div>

      <section className="section section--tight" aria-label="Project details">
        <div className="container split">
          <h2 className="section-title" data-reveal>
            Scope of <em>work.</em>
          </h2>
          <div data-stagger>
            <ul className="check-list">
              {c.services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            {related && (
              <Link href={`/services/${related.slug}/`} className="link-arrow detail-link">
                About {related.title} →
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-label="Next project">
        <div className="container">
          <Link href={`/work/${next.slug}/`} className="next-case" data-reveal data-cursor="view">
            <span className="next-case__label">Next project</span>
            <span className="next-case__title">{next.title}</span>
            <span className="next-case__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </section>

      <CtaBand />
    </Reveal>
  )
}
