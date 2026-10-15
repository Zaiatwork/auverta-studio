import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/sections/PageHero'
import Reveal from '@/components/ui/Reveal'
import CtaBand from '@/components/sections/CtaBand'
import { SERVICE_PAGES } from '@/lib/pages'

export const metadata: Metadata = {
  title: 'Services | Auverta',
  description:
    'Web design and development, branding, AI creative, marketing and content: one accountable team across strategy, design, technology and growth.',
  alternates: { canonical: '/services/' },
}

export default function ServicesPage() {
  return (
    <Reveal>
      <PageHero
        eyebrow="Services"
        title={
          <>
            One team. <em>Every discipline.</em>
          </>
        }
        lead="Strategy, design, engineering, AI and growth under one roof, so your project is never handed between vendors."
      />

      <section className="section section--tight" aria-label="All services">
        <div className="container">
          <ul className="svc-list" data-stagger>
            {SERVICE_PAGES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}/`} className="svc-row" data-cursor="view">
                  <span className="svc-row__num">{s.number}</span>
                  <span className="svc-row__main">
                    <span className="svc-row__title">{s.title}</span>
                    <span className="svc-row__desc">{s.description}</span>
                    <span className="svc-row__tags">
                      {s.tags.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </span>
                  </span>
                  {s.image && (
                    <span className="svc-row__thumb">
                      <Image src={s.image.src} alt="" width={640} height={340} sizes="(max-width: 900px) 90vw, 28vw" />
                    </span>
                  )}
                  <span className="svc-row__arrow" aria-hidden="true">
                    →
                  </span>
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
