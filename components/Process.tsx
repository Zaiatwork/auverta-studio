'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, MQ } from '@/lib/gsap'
import { PROCESS } from '@/lib/content'

export default function Process() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MQ.motion, () => {
        gsap.fromTo(
          '.process .section-header > *',
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, stagger: 0.12, scrollTrigger: { trigger: '.process .section-header', start: 'top 82%' } }
        )
      })

      // Desktop: the section pins and the phases travel horizontally past a progress rail.
      mm.add(MQ.desktop, () => {
        const track = root.current!.querySelector<HTMLElement>('.process__track')!
        const distance = () => track.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(track).paddingLeft)

        const steps = gsap.utils.toArray<HTMLElement>('.process-step')
        const railSteps = gsap.utils.toArray<HTMLElement>('.process__rail-step')
        let current = -1
        const setActive = (progress: number) => {
          // Exactly one phase is active, derived from pin progress — no gaps between cards.
          const i = Math.min(steps.length - 1, Math.floor(progress * steps.length))
          if (i === current) return
          current = i
          steps.forEach((el, j) => el.classList.toggle('is-active', j === i))
          railSteps.forEach((el, j) => el.classList.toggle('is-active', j <= i))
        }

        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            id: 'process-pin', // the icon journey anchors to this pin
            trigger: '.process__pin',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set('.process__rail-fill', { scaleX: self.progress })
              setActive(self.progress)
            },
            onRefresh: (self) => setActive(self.progress),
          },
        })
      })

      // Tablet / mobile: vertical timeline, line fills as you read.
      mm.add('(max-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.process__line-fill',
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.process__track', start: 'top 70%', end: 'bottom 70%', scrub: true } }
        )
        gsap.utils.toArray<HTMLElement>('.process-step').forEach((step) => {
          gsap.fromTo(step, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, scrollTrigger: { trigger: step, start: 'top 82%' } })
          ScrollTrigger.create({
            trigger: step,
            start: 'top 65%',
            end: 'bottom 65%',
            toggleClass: 'is-active',
          })
        })
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} className="section process" id="process" aria-labelledby="process-title">
      <div className="container">
        <header className="section-header section-header--split">
          <div>
            <p className="section-eyebrow">How We Work</p>
            <h2 className="section-title" id="process-title">
              Strategic <em>process.</em>
            </h2>
          </div>
          <p className="section-subtitle">
            A proven workflow that blends research, strategy and creative execution, from first conversation to
            continuous growth.
          </p>
        </header>
      </div>

      <div className="process__pin">
        <div className="container process__rail" aria-hidden="true">
          <div className="process__rail-steps">
            {PROCESS.map((s) => (
              <span key={s.number} className="process__rail-step">
                {s.number} {s.phase}
              </span>
            ))}
          </div>
          <div className="process__rail-line">
            <span className="process__rail-fill" />
          </div>
        </div>

        <div className="process__track">
          <span className="process__line" aria-hidden="true">
            <span className="process__line-fill" />
          </span>
          <ol className="process__steps">
          {PROCESS.map((step) => (
            <li key={step.number} className="process-step">
              <span className="process-step__number" aria-hidden="true">
                {step.number}
              </span>
              <p className="process-step__phase">{step.phase}</p>
              <h3 className="process-step__title">{step.title}</h3>
              <p className="process-step__desc">{step.description}</p>
              <ul className="process-step__deliverables" aria-label={`${step.phase} deliverables`}>
                {step.deliverables.map((d) => (
                  <li key={d} className="tag">
                    {d}
                  </li>
                ))}
              </ul>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
