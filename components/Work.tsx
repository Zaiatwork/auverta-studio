'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, useGSAP, MQ } from '@/lib/gsap'
import { SHOWCASE } from '@/lib/content'

export default function Work() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MQ.motion, () => {
        gsap.fromTo(
          '.work .section-header > *',
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, stagger: 0.12, scrollTrigger: { trigger: '.work .section-header', start: 'top 82%' } }
        )

        // Sticky cards can't be measured reliably as triggers, so every trigger is
        // the static zero-height marker placed just before its card in the flow.
        const markers = gsap.utils.toArray<HTMLElement>('.work-card__marker')
        gsap.utils.toArray<HTMLElement>('.work-card').forEach((card, i) => {
          const marker = markers[i]
          const frame = card.querySelector('.work-card__inner')
          const img = card.querySelector('.work-card__img')
          const info = card.querySelectorAll('.work-card__info > *')

          // Reveal: the whole card opens out from an inset, the image settles from a slight zoom.
          gsap.fromTo(
            frame,
            { clipPath: 'inset(10% 7% 10% 7% round 10px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 10px)', ease: 'none', scrollTrigger: { trigger: marker, start: 'top 100%', end: 'top 35%', scrub: true } }
          )
          gsap.fromTo(
            img,
            { scale: 1.25 },
            { scale: 1, ease: 'none', scrollTrigger: { trigger: marker, start: 'top bottom', end: 'top top', scrub: true } }
          )
          gsap.fromTo(
            info,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, stagger: 0.08, scrollTrigger: { trigger: marker, start: 'top 40%' } }
          )
        })
      })

      // Desktop: cards are sticky (CSS); each one recedes as the next slides over it.
      mm.add(MQ.desktop, () => {
        const cards = gsap.utils.toArray<HTMLElement>('.work-card')
        const markers = gsap.utils.toArray<HTMLElement>('.work-card__marker')
        cards.forEach((card, i) => {
          const next = markers[i + 1]
          if (!next) return
          const st = { trigger: next, start: 'top bottom', end: 'top 12%', scrub: true }
          gsap.to(card.querySelector('.work-card__inner'), { scale: 0.9, ease: 'none', scrollTrigger: st })
          gsap.to(card.querySelector('.work-card__shade'), { opacity: 0.75, ease: 'none', scrollTrigger: { ...st } })
        })
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} className="section work" id="work" aria-labelledby="work-title">
      <div className="container">
        <header className="section-header section-header--split">
          <div>
            <p className="section-eyebrow">Showcase</p>
            <h2 className="section-title" id="work-title">
              Work in <em>focus.</em>
            </h2>
          </div>
          <p className="section-subtitle">
            Studio pieces across web, brand, AI and growth, showing the craft we bring to every engagement. Client case
            studies are shared on request.
          </p>
        </header>
      </div>

      <div className="work__stack">
        {SHOWCASE.map((item, i) => [
          <span key={`m-${item.id}`} className="work-card__marker" aria-hidden="true" />,
          <article
            key={item.id}
            className="work-card"
            style={{ '--i': i } as React.CSSProperties}
            aria-labelledby={`work-${item.id}`}
            data-cursor="view"
          >
            <div className="work-card__inner">
              <div className="work-card__media">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="100vw"
                  className="work-card__img"
                  quality={75}
                />
                <div className="work-card__gradient" aria-hidden="true" />
              </div>

              <div className="container work-card__info">
                <p className="work-card__index">
                  <span>{item.id}</span> / {String(SHOWCASE.length).padStart(2, '0')}
                </p>
                <h3 className="work-card__title" id={`work-${item.id}`}>
                  {item.title}
                </h3>
                <div className="work-card__meta">
                  <p className="work-card__discipline">{item.discipline}</p>
                  <p className="work-card__desc">{item.description}</p>
                </div>
              </div>
              <div className="work-card__shade" aria-hidden="true" />
            </div>
          </article>,
        ])}
      </div>

      <div className="container work__footer">
        <p>Want to see work relevant to your industry?</p>
        <a href="#contact" className="link-arrow" data-cursor="start">
          Request the full portfolio <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
