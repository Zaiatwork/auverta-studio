'use client'

import { useRef } from 'react'
import { gsap, useGSAP, MQ } from '@/lib/gsap'
import BrandMark from './BrandMark'

const WORD = 'AUVERTA'

/**
 * The end of the icon journey: the travelling 3D mark settles into the slot marked
 * `data-journey-target` (see lib/journey.ts), and the line-art wordmark draws in
 * beside it over the same last stretch of scroll. The SVG mark in the slot is shown
 * only when the 3D journey isn't running.
 */
export default function FooterLockup() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          '.lockup__letter',
          { clipPath: 'inset(100% 0% 0% 0%)', yPercent: 18 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            yPercent: 0,
            ease: 'power2.out',
            stagger: 0.08,
            // The footer is outside this component's scope, so pass the element itself.
            scrollTrigger: { trigger: root.current!.closest('footer'), start: 'top 85%', end: 'bottom bottom', scrub: true },
          }
        )
      })
    },
    { scope: root }
  )

  return (
    <div className="lockup" ref={root}>
      <span className="lockup__mark" data-journey-target>
        <BrandMark className="lockup__mark-svg" />
      </span>
      <span className="lockup__word" role="img" aria-label="Auverta">
        {WORD.split('').map((ch, i) => (
          <span key={i} className="lockup__letter" aria-hidden="true">
            {ch}
          </span>
        ))}
      </span>
    </div>
  )
}
