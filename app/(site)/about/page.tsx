import type { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import Reveal from '@/components/ui/Reveal'
import CtaBand from '@/components/sections/CtaBand'
import { ABOUT } from '@/lib/pages'
import { DISCIPLINES, VALUES } from '@/lib/content'

export const metadata: Metadata = {
  title: 'About | Auverta',
  description: ABOUT.lead,
  alternates: { canonical: '/about/' },
}

export default function AboutPage() {
  return (
    <Reveal>
      <PageHero
        eyebrow="About"
        title={
          <>
            Beyond <em>ordinary.</em>
          </>
        }
        lead={ABOUT.lead}
      />

      <section className="section section--tight" aria-label="Our story">
        <div className="container split">
          <h2 className="section-title" data-reveal>
            Why we <em>exist.</em>
          </h2>
          <div className="prose" data-stagger>
            {ABOUT.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-label="Disciplines">
        <div className="container">
          <ul className="disciplines" data-stagger>
            {DISCIPLINES.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="values-title">
        <div className="container">
          <header className="section-header" data-reveal>
            <p className="section-eyebrow">Principles</p>
            <h2 className="section-title" id="values-title">
              How we <em>work.</em>
            </h2>
          </header>
          <ul className="values" data-stagger>
            {VALUES.map((v) => (
              <li key={v.number} className="values__item">
                <span className="approach__num">{v.number}</span>
                <h3 className="approach__title">{v.title}</h3>
                <p className="approach__body">{v.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </Reveal>
  )
}
