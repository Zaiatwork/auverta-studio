'use client'

import { useRef } from 'react'
import { gsap, useGSAP, MQ } from '@/lib/gsap'
import BrandMark from '@/components/ui/BrandMark'

// The 3D mark is rendered by <IconJourney> (a fixed layer behind the page) so the same
// object can travel from here to the footer. The SVG mark below only shows when it can't.
//
// The headline is set on the mark's diagonal: "Where vision" top left, "Takes form." bottom
// right, the mark between them. On scroll the two lines part along that diagonal with the
// mark's two strokes, and "Takes form." fills from line art to solid ink.
export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MQ.motion, () => {
        document.documentElement.classList.add('hero-in')

        // Line art at rest; the scroll fills it in. Without motion it stays solid (CSS default).
        gsap.set('.hero__form-fill', { clipPath: 'inset(0% 100% 0% 0%)' })

        const intro = gsap.timeline({ delay: 0.2, defaults: { ease: 'expo.out' } })
        // y: 0 clears the CSS pre-hide transform, which GSAP would otherwise parse into a px offset.
        intro
          .fromTo('.hero__line-inner', { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.4, stagger: 0.16 })
          .fromTo('[data-hero="sub"]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1 }, '-=0.9')
          .fromTo('[data-hero="actions"]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1 }, '<0.1')
        // Scroll: one scrubbed timeline over the hero's own height (no pin, so the journey's
        // scroll anchors stay where they are). The mark splits at 0.45vh; the type splits with it.
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
          })
          .to('.hero__line--vision', { xPercent: -16, yPercent: -70, duration: 1 }, 0)
          .to('.hero__line--form', { xPercent: 12, yPercent: 60, duration: 1 }, 0)
          .to('.hero__form-fill', { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55 }, 0)
          .to('.hero__body', { autoAlpha: 0, y: -48, duration: 0.4 }, 0)
          .to('.hero__glow', { autoAlpha: 0, duration: 1 }, 0)
      })
    },
    { scope: root }
  )

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <BrandMark className="hero__mark-static" />

      <div className="container hero__container">
        <div className="hero__content">
          <h1 className="hero__headline" id="hero-title">
            <span className="hero__line hero__line--vision">
              <span className="hero__line-inner">Where vision</span>
            </span>
            <span className="hero__line hero__line--form">
              <span className="hero__line-inner">
                <span className="hero__form-outline">Takes form.</span>
                <span className="hero__form-fill" aria-hidden="true">
                  Takes form.
                </span>
              </span>
            </span>
          </h1>

          <div className="hero__body">
            <p className="hero__subline" data-hero="sub">
              A creative technology and digital growth studio. We bring strategy, design, technology and AI together
              to build digital experiences that grow brands.
            </p>

            <div className="hero__actions" data-hero="actions">
              <a href="#contact" className="btn btn--primary" data-cursor="start">
                Start a project
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <a href="#work" className="btn btn--ghost">
                See our work
              </a>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
