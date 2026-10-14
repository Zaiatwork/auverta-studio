import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import CtaBand from '@/components/CtaBand'
import JsonLd from '@/components/JsonLd'
import { PROCESS } from '@/lib/content'
import { FAQ_GENERAL } from '@/lib/pages'

export const metadata: Metadata = {
  title: 'Process | Auverta',
  description:
    'Our five-phase workflow: discover, strategize, create, build and grow. Research, strategy and creative execution from first conversation to continuous growth.',
  alternates: { canonical: '/process/' },
}

export default function ProcessPage() {
  return (
    <Reveal>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ_GENERAL.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
      <PageHero
        eyebrow="Process"
        title={
          <>
            Strategic <em>process.</em>
          </>
        }
        lead="A proven workflow that blends research, strategy and creative execution, from first conversation to continuous growth."
      />

      <section className="section section--tight" aria-label="Phases">
        <div className="container">
          <ol className="phases">
            {PROCESS.map((p) => (
              <li key={p.number} className="phase" data-reveal>
                <span className="phase__num" aria-hidden="true">
                  {p.number}
                </span>
                <div className="phase__body">
                  <p className="phase__phase">{p.phase}</p>
                  <h2 className="phase__title">{p.title}</h2>
                  <p className="phase__desc">{p.description}</p>
                  <ul className="phase__tags" aria-label={`${p.phase} deliverables`}>
                    {p.deliverables.map((d) => (
                      <li key={d} className="tag">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="faq-title">
        <div className="container split">
          <h2 className="section-title" id="faq-title" data-reveal>
            Before we <em>begin.</em>
          </h2>
          <div className="faq" data-stagger>
            {FAQ_GENERAL.map((f) => (
              <details key={f.q} className="faq__item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </Reveal>
  )
}
