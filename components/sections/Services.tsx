'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap, useGSAP, MQ } from '@/lib/gsap'
import { SERVICES } from '@/lib/content'

export default function Services() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const hovering = useRef(false)

  // While not hovering, the row crossing the middle of the viewport becomes active.
  useEffect(() => {
    const rows = root.current?.querySelectorAll<HTMLElement>('.service-item')
    if (!rows) return
    const io = new IntersectionObserver(
      (entries) => {
        if (hovering.current) return
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
        })
      },
      { rootMargin: '-48% 0px -48% 0px' }
    )
    rows.forEach((r) => io.observe(r))
    return () => io.disconnect()
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          '.services .section-header > *',
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, stagger: 0.12, scrollTrigger: { trigger: '.services .section-header', start: 'top 82%' } }
        )
        gsap.fromTo(
          '.service-item',
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, stagger: 0.08, scrollTrigger: { trigger: '.services__list', start: 'top 80%' } }
        )
        gsap.fromTo(
          '.services__visual',
          { clipPath: 'inset(12% 12% 12% 12%)', autoAlpha: 0 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            autoAlpha: 1,
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.services__body', start: 'top 75%' },
          }
        )
      })
    },
    { scope: root }
  )

  const current = SERVICES[active]

  return (
    <section ref={root} className="section services" id="services" aria-labelledby="services-title">
      <div className="container">
        <header className="section-header section-header--split">
          <div>
            <h2 className="section-title" id="services-title">
              Capabilities, <em>connected.</em>
            </h2>
          </div>
          <p className="section-subtitle">
            Five integrated disciplines, one studio. Each capability stands on its own and compounds when they work
            together.
          </p>
        </header>

        <div className="services__body">
          <ol
            className="services__list"
            onPointerEnter={() => (hovering.current = true)}
            onPointerLeave={() => (hovering.current = false)}
          >
            {SERVICES.map((service, i) => (
              <li
                key={service.number}
                className={`service-item${active === i ? ' is-active' : ''}`}
                data-index={i}
                data-cursor="explore"
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                {service.image && (
                  <div className="service-item__media" aria-hidden="true">
                    <Image src={service.image.src} alt="" fill sizes="92vw" />
                  </div>
                )}
                <span className="service-item__number" aria-hidden="true">
                  {service.number}
                </span>
                <div className="service-item__content">
                  <h3 className="service-item__title">
                    <a href="#contact" className="service-item__link">
                      {service.title}
                    </a>
                  </h3>
                  <div className="service-item__detail">
                    <div>
                      <p className="service-item__desc">{service.description}</p>
                      <ul className="service-item__tags" aria-label={`${service.title} includes`}>
                        {service.tags.map((tag) => (
                          <li key={tag} className="tag">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <span className="service-item__arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 12L12 2M12 2H5M12 2V9" />
                  </svg>
                </span>
              </li>
            ))}
          </ol>

          <div className="services__visual" aria-hidden="true">
            {SERVICES.map((service, i) =>
              service.image ? (
                <div key={service.number} className={`services__frame${active === i ? ' is-active' : ''}`}>
                  <Image src={service.image.src} alt="" fill sizes="40vw" />
                </div>
              ) : null
            )}
            <div className="services__caption">
              <span className="services__caption-num">{current.number}</span>
              <span className="services__caption-title">{current.title}</span>
              <span className="services__caption-count">/ {String(SERVICES.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        <div className="services__footer">
          <p>Not sure which capability fits? Start with a conversation and we&apos;ll map the right path.</p>
          <a href="#contact" className="btn btn--primary" data-cursor="start">
            Start a project
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
