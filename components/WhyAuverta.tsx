'use client'

import { useRef, useState } from 'react'
import { gsap, useGSAP, MQ } from '@/lib/gsap'
import { DISCIPLINES, VALUES } from '@/lib/content'
import { MARK_PATHS as MARK } from '@/components/BrandMark'

const SIZE = 600
const C = SIZE / 2
const R = 218

const nodes = DISCIPLINES.map((label, i) => {
  const a = (-90 + (i * 360) / DISCIPLINES.length) * (Math.PI / 180)
  return { label, x: C + R * Math.cos(a), y: C + R * Math.sin(a) }
})

const chords: [number, number][] = []
for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) chords.push([a, b])

const round = (n: number) => Math.round(n * 100) / 100

export default function WhyAuverta() {
  const root = useRef<HTMLElement>(null)
  const [hot, setHot] = useState<number | null>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          '.why .section-header > *',
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, stagger: 0.12, scrollTrigger: { trigger: '.why .section-header', start: 'top 82%' } }
        )

        const tl = gsap.timeline({ scrollTrigger: { trigger: '.why__map', start: 'top 75%' } })
        tl.fromTo('.why__ring', { opacity: 0 }, { opacity: 1, duration: 0.8 })
          .fromTo('.why__spoke', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.06, ease: 'power2.inOut' }, '<')
          .fromTo('.why__node, .why__dot', { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.06, ease: 'back.out(2)' }, '-=0.8')
          .fromTo('.why__chord', { opacity: 0 }, { opacity: 1, duration: 1.2, stagger: 0.01 }, '-=0.4')
          .fromTo('.why__mark', { autoAlpha: 0, scale: 0.8, svgOrigin: '256 256' }, { autoAlpha: 1, scale: 1, duration: 1, ease: 'expo.out' }, '-=1.2')

        gsap.fromTo(
          '.value',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, stagger: 0.08, scrollTrigger: { trigger: '.why__values', start: 'top 80%' } }
        )

        gsap.fromTo(
          '.why__quote',
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 1.2, scrollTrigger: { trigger: '.why__quote', start: 'top 85%' } }
        )
      })
    },
    { scope: root }
  )

  const isLinked = (a: number, b: number) => hot !== null && (a === hot || b === hot)

  return (
    <section ref={root} className="section why" id="why" aria-labelledby="why-title">
      <div className="container">
        <header className="section-header section-header--split">
          <div>
            <p className="section-eyebrow">Why Auverta</p>
            <h2 className="section-title" id="why-title">
              One team.
              <br />
              <em>Multiple disciplines.</em>
            </h2>
          </div>
          <p className="section-subtitle">
            Most studios are great at design or great at marketing. Auverta connects every discipline needed to
            build, launch and grow a brand, so nothing is lost between hand-offs.
          </p>
        </header>

        <div className="why__body">
          <div className="why__map" onPointerLeave={() => setHot(null)}>
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="why__svg" aria-hidden="true">
              <circle className="why__ring" cx={C} cy={C} r={R} />
              <circle className="why__ring why__ring--inner" cx={C} cy={C} r={R * 0.42} />
              {chords.map(([a, b]) => (
                <line
                  key={`${a}-${b}`}
                  className={`why__chord${isLinked(a, b) ? ' is-hot' : ''}`}
                  x1={round(nodes[a].x)}
                  y1={round(nodes[a].y)}
                  x2={round(nodes[b].x)}
                  y2={round(nodes[b].y)}
                />
              ))}
              {nodes.map((n, i) => (
                <line
                  key={n.label}
                  className={`why__spoke${hot === i ? ' is-hot' : ''}`}
                  x1={C}
                  y1={C}
                  x2={round(n.x)}
                  y2={round(n.y)}
                  pathLength={1}
                  strokeDasharray="1"
                />
              ))}
              {nodes.map((n, i) => (
                <circle key={n.label} className={`why__dot${hot === i ? ' is-hot' : ''}`} cx={round(n.x)} cy={round(n.y)} r={5} />
              ))}
              {/* Outer group positions the mark; inner group is what GSAP scales (CSS transform would replace the attribute). */}
              <g transform={`translate(${C - 46} ${C - 46}) scale(${92 / 512})`}>
                <g className="why__mark">
                  {MARK.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </g>
              </g>
            </svg>

            <ul className="why__labels" aria-label="Disciplines under one roof">
              {nodes.map((n, i) => (
                <li
                  key={n.label}
                  className={`why__node${hot === i ? ' is-hot' : ''}`}
                  style={{ left: `${(n.x / SIZE) * 100}%`, top: `${(n.y / SIZE) * 100}%` }}
                  data-side={n.x < C - 10 ? 'left' : n.x > C + 10 ? 'right' : 'center'}
                  data-top={n.y < C ? 'true' : 'false'}
                  onPointerEnter={() => setHot(i)}
                >
                  {n.label}
                </li>
              ))}
            </ul>
          </div>

          <ol className="why__values">
            {VALUES.map((v) => (
              <li key={v.number} className="value">
                <span className="value__number">{v.number}</span>
                <div>
                  <h3 className="value__title">{v.title}</h3>
                  <p className="value__desc">{v.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <blockquote className="why__quote">
          <p>
            Beyond ordinary is not a tagline. <em>It&apos;s our standard.</em>
          </p>
        </blockquote>
      </div>
    </section>
  )
}
