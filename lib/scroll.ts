'use client'

import type Lenis from 'lenis'

let lenis: Lenis | null = null

export const setLenis = (instance: Lenis | null) => {
  lenis = instance
}

export const getLenis = () => lenis

/** Scroll to an in-page target, offset for the fixed nav. Works with or without Lenis. */
export function scrollToTarget(target: string | HTMLElement, offset = -72) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!el && target !== '#top') return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Links inside the mobile menu fire while the page is still scroll-locked;
  // release the lock now rather than waiting for the menu's effect to run.
  document.documentElement.classList.remove('menu-open')
  if (lenis?.isStopped) lenis.start()

  if (lenis) {
    lenis.scrollTo(target === '#top' ? 0 : (el as HTMLElement), {
      offset,
      duration: reduced ? 0 : 1.4,
      immediate: reduced,
    })
  } else {
    const top = target === '#top' ? 0 : (el as HTMLElement).getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
  }

  // Move focus for keyboard / screen-reader users without a second jump.
  if (el) {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }
}
