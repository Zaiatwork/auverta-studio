'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { scrollToTarget, setLenis } from '@/lib/scroll'

interface SmoothScrollProps {
  children: React.ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches

    // Mobile browsers resize the viewport as the address bar shows/hides; re-measuring every
    // pin mid-scroll causes visible jumps, so only real resizes trigger a refresh.
    ScrollTrigger.config({ ignoreMobileResize: true })

    // Smooth wheel only on desktop pointers with motion allowed.
    // Touch devices keep native momentum scrolling, which feels better and costs nothing.
    let lenis: Lenis | null = null
    let tick: ((time: number) => void) | null = null

    if (!reduced && !coarse) {
      // Lerp damping (frame-rate independent) instead of a fixed-duration ease: each wheel
      // tick blends into the motion already under way, so fast or trackpad scrolling stays fluid.
      lenis = new Lenis({
        lerp: 0.075,
        wheelMultiplier: 0.9,
        smoothWheel: true,
      })
      setLenis(lenis)
      document.documentElement.classList.add('lenis')

      // Lenis is driven by GSAP's ticker only — a single RAF loop keeps
      // ScrollTrigger and Lenis on the same frame.
      lenis.on('scroll', ScrollTrigger.update)
      tick = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }

    // One delegated handler for every in-page anchor on the site.
    // Markup stays plain <a href="#id"> so it works without JS too.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || href === '#') return
      if (href !== '#top' && !document.querySelector(href)) return
      e.preventDefault()
      scrollToTarget(href)
      history.replaceState(null, '', href === '#top' ? location.pathname : href)
    }
    document.addEventListener('click', onClick)

    // Fonts and images change layout after first paint.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('load', refresh)
      if (tick) gsap.ticker.remove(tick)
      lenis?.destroy()
      setLenis(null)
      document.documentElement.classList.remove('lenis')
    }
  }, [])

  return <>{children}</>
}
