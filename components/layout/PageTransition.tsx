'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { getLenis } from '@/lib/scroll'

// The very first mount is the initial page load: no curtain, the page's own intro plays.
let firstMount = true

/**
 * Route transition. app/template.tsx remounts this on every navigation, so each new page
 * starts under an accent curtain that lifts away. Scroll is reset because Lenis keeps its
 * own target position across routes.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    getLenis()?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)

    if (firstMount) {
      firstMount = false
      return
    }
    if (prefersReducedMotion() || !curtain.current) return

    gsap.fromTo(
      curtain.current,
      { autoAlpha: 1, yPercent: 0 },
      { yPercent: -100, duration: 0.95, ease: 'expo.inOut', delay: 0.05, onComplete: () => gsap.set(curtain.current, { autoAlpha: 0 }) }
    )
  }, [])

  return (
    <>
      <div ref={curtain} className="page-curtain" aria-hidden="true" />
      {children}
    </>
  )
}
