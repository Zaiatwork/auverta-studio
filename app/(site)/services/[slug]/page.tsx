import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageHero from '@/components/sections/PageHero'
import Reveal from '@/components/ui/Reveal'
import CtaBand from '@/components/sections/CtaBand'
import JsonLd from '@/components/ui/JsonLd'
import { SERVICE_PAGES } from '@/lib/pages'
import { SITE_URL } from '@/lib/config/env'

export const dynamicParams = false

export function generateStaticParams() {
  return SERVICE_PAGES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const s = SERVICE_PAGES.find((x) => x.slug === slug)
  if (!s) return {}
  return {
    title: `${s.title} | Auverta`,
    description: s.detail.lead,
    alternates: { canonical: `/services/${s.slug}/` },
    openGraph: s.image ? { images: [{ url: s.image.src, alt: s.image.alt }] } : undefined,
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const idx = SERVICE_PAGES.findIndex((x) => x.slug === slug)
  if (idx === -1) notFound()
  const s = SERVICE_PAGES[idx]
  const others = SERVICE_PAGES.filter((x) => x.slug !== slug)

  return (
    <Reveal>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: s.title,
            description: s.detail.lead,
            url: `${SITE_URL}/services/${s.slug}/`,
            provider: { '@type': 'Organization', name: 'Auverta', url: SITE_URL },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: s.detail.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]}
      />
      <PageHero
        eyebrow={`${s.number} / ${s.title}`}
        title={s.detail.headline}
        lead={s.detail.lead}
        crumbs={[
          { label: 'Services', href: '/services/' },
          { label: s.title, href: `/services/${s.slug}/` },
        ]}
      >
        <div className="page-hero__tags">
          {s.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </PageHero>

      {s.image && (
        <div className="container">
          <div className="feature-image" data-parallax data-reveal>
            <Image src={s.image.src} alt={s.image.alt} width={1344} height={700} sizes="(max-width: 1440px) 92vw, 1300px" priority />
          </div>
        </div>
      )}

      <section className="section" aria-labelledby="approach-title">
        <div className="container">
          <header className="section-header section-header--split" data-reveal>
            <h2 className="section-title" id="approach-title">
              How we <em>approach it.</em>
            </h2>
            <p className="section-subtitle">{s.description}</p>
          </header>
          <ol className="approach" data-stagger>
            {s.detail.approach.map((a, i) => (
              <li key={a.title} className="approach__item">
                <span className="approach__num">0{i + 1}</span>
                <h3 className="approach__title">{a.title}</h3>
                <p className="approach__body">{a.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="includes-title">
        <div className="container split">
          <h2 className="section-title" id="includes-title" data-reveal>
            What&apos;s <em>included.</em>
          </h2>
          <ul className="check-list" data-stagger>
            {s.detail.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="container split">
          <h2 className="section-title" id="faq-title" data-reveal>
            Good <em>questions.</em>
          </h2>
          <div className="faq" data-stagger>
            {s.detail.faqs.map((f) => (
              <details key={f.q} className="faq__item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="more-title">
        <div className="container">
          <h2 className="more__title" id="more-title" data-reveal>
            More services
          </h2>
          <ul className="more-list" data-stagger>
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/services/${o.slug}/`} className="more-list__link">
                  <span>{o.number}</span>
                  {o.title}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </Reveal>
  )
}
