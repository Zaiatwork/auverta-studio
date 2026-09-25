'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { gsap, ScrollTrigger, useGSAP, MQ } from '@/lib/gsap'
import { PILLARS } from '@/lib/content'

// WebGL is client-only and non-critical: load it after the headline paints.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false, loading: () => null })

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const scroll = useRef(0)
  const [sceneActive, setSceneActive] = useState(true)
  const [sceneReady, setSceneReady] = useState(false)

  // Pause 3D rendering whenever the hero is off-screen.
  useEffect(() => {
    if (!root.current) return
    const io = new IntersectionObserver(([entry]) => setSceneActive(entry.isIntersecting), { threshold: 0 })
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MQ.motion, () => {
        document.documentElement.classList.add('hero-in')

        const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'expo.out' } })
        tl.fromTo('[data-hero="eyebrow"]', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9 })
          // y: 0 clears the CSS pre-hide transform, which GSAP would otherwise parse into a px offset.
          .fromTo('.hero__line-inner', { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.3, stagger: 0.12 }, '<0.1')
          .fromTo('[data-hero="pillar"]', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 }, '-=0.9')
          .fromTo('[data-hero="sub"]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1 }, '<0.1')
          .fromTo('[data-hero="actions"]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1 }, '<0.1')
          .fromTo('[data-hero="meta"]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, stagger: 0.1 }, '<0.2')

        // Scroll-out: content drifts up and fades while the 3D mark splits apart.
        gsap.to('.hero__content', {
          yPercent: -18,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 20%', scrub: true },
        })
      })

      // The 3D mark reads scroll progress every frame.
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          scroll.current = self.progress
        },
      })
    },
    { scope: root }
  )

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className={`hero__canvas${sceneReady ? ' is-ready' : ''}`} aria-hidden="true">
        <HeroScene scroll={scroll} active={sceneActive} onReady={() => setSceneReady(true)} />
      </div>
      <div className="hero__overlay" aria-hidden="true" />

      <div className="container hero__container">
        <div className="hero__content">
          <p className="hero__eyebrow" data-hero="eyebrow">
            Auverta · Beyond Ordinary
          </p>

          <h1 className="hero__headline" id="hero-title">
            <span className="hero__line">
              <span className="hero__line-inner">Where Vision</span>
            </span>
            <span className="hero__line">
              <span className="hero__line-inner hero__headline-italic">Takes Form.</span>
            </span>
          </h1>

          <ul className="hero__pillars" aria-label="What we combine">
            {PILLARS.map((p, i) => (
              <li key={p} data-hero="pillar">
                {p}
                {i < PILLARS.length - 1 && (
                  <span className="hero__times" aria-hidden="true">
                    ×
                  </span>
                )}
              </li>
            ))}
          </ul>

          <p className="hero__subline" data-hero="sub">
            A creative technology and digital growth studio. We combine strategy, design, technology and AI into
            premium digital experiences that grow brands.
          </p>

          <div className="hero__actions" data-hero="actions">
            <a href="#contact" className="btn btn--primary" data-cursor="start">
              Start a Project
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
            <a href="#work" className="btn btn--ghost">
              Explore Our Work
            </a>
          </div>
        </div>
      </div>

      <div className="hero__scroll-indicator" data-hero="meta" aria-hidden="true">
        <span className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </div>
      <p className="hero__year" data-hero="meta">
        Creative Technology Studio · ©&nbsp;2026
      </p>
    </section>
  )
}
