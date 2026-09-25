'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, useGSAP, MQ } from '@/lib/gsap'

const STATEMENT =
  'One studio where strategy, design, technology, AI and growth work as a single system.'

const EQUATION = [
  { word: 'Strategy', note: 'Research, positioning and growth briefs' },
  { word: 'Design', note: 'Brand identity, UI/UX and art direction' },
  { word: 'Technology', note: 'Websites and platforms, engineered to perform' },
  { word: 'AI', note: 'Generative imagery, video and workflows' },
  { word: 'Growth', note: 'SEO, paid media and conversion' },
]

export default function Positioning() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MQ.motion, () => {
        gsap.fromTo(
          '.positioning__intro [data-fade]',
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, stagger: 0.12, scrollTrigger: { trigger: '.positioning__intro', start: 'top 80%' } }
        )

        // Statement: words brighten as you read down the page.
        gsap.fromTo(
          '.positioning__statement .pw',
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: { trigger: '.positioning__statement', start: 'top 78%', end: 'bottom 45%', scrub: true },
          }
        )
      })

      // Equation: pinned on desktop, scrubbed in-flow on smaller screens.
      mm.add(
        { desktop: MQ.desktop, motion: MQ.motion },
        (ctx) => {
          const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean }
          if (!motion) return
          const rows = gsap.utils.toArray<HTMLElement>('.eq-row')
          const result = '.eq-result'
          const stage = root.current!.querySelector('.positioning__stage')!
          if (desktop) stage.classList.add('is-pinned')

          const tl = gsap.timeline({
            defaults: { ease: 'power2.inOut', duration: 1 },
            scrollTrigger: desktop
              ? { trigger: '.positioning__stage', start: 'top top', end: `+=${rows.length * 55}%`, pin: true, scrub: 0.6 }
              : { trigger: '.positioning__stage', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
          })

          gsap.set(rows, { opacity: 0.14 })
          gsap.set(result, { autoAlpha: 0, yPercent: 30 })

          rows.forEach((row, i) => {
            tl.to(row, { opacity: 1 }, i)
              .fromTo(row.querySelector('.eq-note'), { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0 }, i)
              .to('.eq-progress__bar', { scaleX: (i + 1) / (rows.length + 1) }, i)
            if (i > 0) tl.to(rows[i - 1], { opacity: 0.4 }, i)
          })

          tl.to(rows, { opacity: desktop ? 0.04 : 0.2 }, rows.length)
            .to('.eq-note', { autoAlpha: 0 }, rows.length)
            .to(result, { autoAlpha: 1, yPercent: 0 }, rows.length)
            .to('.eq-progress__bar', { scaleX: 1 }, rows.length)

          return () => stage.classList.remove('is-pinned')
        }
      )

      // Background monogram drifts slowly for depth.
      mm.add(MQ.desktop, () => {
        gsap.fromTo(
          '.positioning__number',
          { yPercent: -30 },
          { yPercent: 30, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } }
        )
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} className="section positioning" id="about" aria-labelledby="about-title">
      <div className="positioning__number" aria-hidden="true">
        AU
      </div>

      <div className="container">
        <div className="positioning__intro">
          <div>
            <p className="section-eyebrow" data-fade>
              What We Are
            </p>
            <h2 className="positioning__statement" id="about-title">
              {STATEMENT.split(' ').map((w, i) => (
                <span className="pw" key={i}>
                  {w}{' '}
                </span>
              ))}
            </h2>
          </div>

          <div className="positioning__about" data-fade>
            <p>
              Auverta is a full-service digital growth studio fusing strategic creative direction with
              high-performance web development. From distinct brand identity to high-converting UI/UX, we craft
              digital solutions that elevate your presence, engage modern audiences and power measurable growth.
            </p>
          </div>
        </div>
      </div>

      <div className="positioning__stage">
        <div className="container positioning__stage-inner">
          <p className="positioning__stage-label" aria-hidden="true">
            The Auverta equation
          </p>

          <ol className="eq" aria-label="Strategy, design, technology, AI and growth. Together, that is Auverta">
            {EQUATION.map((e, i) => (
              <li className="eq-row" key={e.word}>
                <span className="eq-op" aria-hidden="true">
                  {i === 0 ? '' : '×'}
                </span>
                <span className="eq-word">{e.word}</span>
                <span className="eq-note">{e.note}</span>
              </li>
            ))}
          </ol>

          <div className="eq-result">
            <span className="eq-result__label">Together, that&apos;s</span>
            <Image
              src="/brand/auverta-logo-white.png"
              alt="Auverta"
              width={1534}
              height={288}
              sizes="(max-width: 768px) 80vw, 46vw"
              className="eq-logo"
            />
          </div>

          <div className="eq-progress" aria-hidden="true">
            <span className="eq-progress__bar" />
          </div>
        </div>
      </div>
    </section>
  )
}
