'use client'

import { useRef } from 'react'
import { gsap, useGSAP, MQ } from '@/lib/gsap'

export default function FinalCTA() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 65%' } })
        tl.fromTo('.cta__line-inner', { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out' })
          .fromTo('.cta__actions', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1 }, '-=0.8')

        // Outlined backdrop word slides across as the section passes.
        gsap.fromTo(
          '.cta__bg-text',
          { xPercent: -38 },
          { xPercent: -62, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } }
        )
        gsap.fromTo(
          '.cta__glow',
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: true } }
        )
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} className="cta" aria-labelledby="cta-title">
      <div className="cta__glow" aria-hidden="true" />
      <div className="cta__bg-text" aria-hidden="true">
        Beyond Ordinary
      </div>

      <div className="container cta__inner">
        <h2 className="cta__headline" id="cta-title">
          <span className="cta__line">
            <span className="cta__line-inner">Let&apos;s build something</span>
          </span>
          <span className="cta__line">
            <span className="cta__line-inner">
              <em>beyond ordinary.</em>
            </span>
          </span>
        </h2>
        <div className="cta__actions">
          <a href="#contact" className="btn btn--primary btn--lg" data-cursor="start">
            Start a project
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </a>
          <a href="#work" className="btn btn--ghost">
            See the work
          </a>
        </div>
      </div>
    </section>
  )
}
