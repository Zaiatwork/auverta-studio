'use client'

import { useRef } from 'react'
import { gsap, useGSAP, MQ } from '@/lib/gsap'

/**
 * Scroll choreography for inner pages. Wrap a page body and mark children with:
 *   data-reveal            fade and rise as it enters
 *   data-stagger           children of this element rise one after another
 *   data-parallax          the <img> inside drifts slower than the page
 *   data-line              a rule that draws left to right
 * Without JS or with reduced motion nothing is hidden, so content is always readable.
 */
export default function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.fromTo(el, { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, scrollTrigger: { trigger: el, start: 'top 88%' } })
        })

        gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
          gsap.fromTo(
            group.children,
            { autoAlpha: 0, y: 36 },
            { autoAlpha: 1, y: 0, stagger: 0.09, scrollTrigger: { trigger: group, start: 'top 85%' } }
          )
        })

        gsap.utils.toArray<HTMLElement>('[data-line]').forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } }
          )
        })

        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((frame) => {
          const img = frame.querySelector('img')
          if (!img) return
          gsap.fromTo(
            img,
            { yPercent: -7, scale: 1.14 },
            { yPercent: 7, scale: 1.14, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } }
          )
        })
      })
    },
    { scope: root }
  )

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  )
}
