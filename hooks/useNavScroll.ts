'use client'

import { useEffect, useState, type RefObject } from 'react'

/**
 * Header scroll behaviour: `scrolled` after leaving the top, `hidden` while scrolling down,
 * and a `--progress` CSS variable (0–1) on the header tracking page progress.
 */
export function useNavScroll(headerRef: RefObject<HTMLElement | null>) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false
    const update = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      headerRef.current?.style.setProperty('--progress', String(max > 0 ? Math.min(1, y / max) : 0))
      setScrolled(y > 40)
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > window.innerHeight * 0.6)
        lastY = y
      }
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [headerRef])

  return { scrolled, hidden }
}
