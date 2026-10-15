import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/sections/PageHero'
import Reveal from '@/components/ui/Reveal'
import CtaBand from '@/components/sections/CtaBand'
import { CASE_PAGES } from '@/lib/pages'

export const metadata: Metadata = {
  title: 'Work | Auverta',
  description: 'Selected studio work across web, branding, AI creative, marketing and content.',
  alternates: { canonical: '/work/' },
}

export default function WorkPage() {
  return (
    <Reveal>
      <PageHero
        eyebrow="Work"
        title={
          <>
            Work in <em>focus.</em>
          </>
        }
        lead="Studio pieces that show how we think across web, brand, AI and growth. Client case studies will be added here as projects launch."
      />

      <section className="section section--tight" aria-label="Selected work">
        <div className="container work-grid">
          {CASE_PAGES.map((c, i) => (
            <Link
              key={c.slug}
              href={`/work/${c.slug}/`}
              className={`work-card${i === 0 ? ' work-card--wide' : ''}`}
              data-reveal
              data-cursor="view"
            >
              <span className="work-card__frame" data-parallax>
                <Image
                  src={c.image.src}
                  alt={c.image.alt}
                  width={c.image.width}
                  height={c.image.height}
                  sizes={i === 0 ? '(max-width: 900px) 92vw, 1300px' : '(max-width: 900px) 92vw, 640px'}
                />
              </span>
              <span className="work-card__meta">
                <span className="work-card__num">{c.id}</span>
                <span className="work-card__title">{c.title}</span>
                <span className="work-card__disc">{c.discipline}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand />
    </Reveal>
  )
}
