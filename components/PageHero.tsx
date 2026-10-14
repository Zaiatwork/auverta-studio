'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { gsap, useGSAP, MQ } from '@/lib/gsap'

type Crumb = { label: string; href: string }

/**
 * Opening block for every inner page: breadcrumb, eyebrow, display title, lead.
 * Elements marked data-hero rise in on load and lift the "hero-in" flag that
 * the boot script uses to decide whether to reveal content as a fallback.
 */
export default function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  lead?: string
  crumbs?: Crumb[]
  children?: React.ReactNode
}) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          '[data-hero]',
          { autoAlpha: 0, y: 46 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.1,
            delay: 0.2,
            onStart: () => document.documentElement.classList.add('hero-in'),
          }
        )
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} className="page-hero" aria-labelledby="page-title">
      <div className="container">
        {crumbs && crumbs.length > 0 && (
          <nav className="crumbs" aria-label="Breadcrumb" data-hero>
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.href}>
                  <Link href={c.href}>{c.label}</Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="section-eyebrow" data-hero>
          {eyebrow}
        </p>
        <h1 className="page-hero__title" id="page-title" data-hero>
          {title}
        </h1>
        {lead && (
          <p className="page-hero__lead" data-hero>
            {lead}
          </p>
        )}
        {children && (
          <div className="page-hero__extra" data-hero>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
