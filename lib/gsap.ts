'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register once for the whole app. Every component imports from here so
// plugins are never registered against a different gsap instance.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
  gsap.defaults({ ease: 'power3.out', duration: 0.9 })
}

export const EASE = {
  out: 'power3.out',
  expo: 'expo.out',
  inOut: 'power2.inOut',
} as const

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Shared breakpoints for gsap.matchMedia() so every section degrades the same way.
export const MQ = {
  desktop: '(min-width: 1025px) and (prefers-reduced-motion: no-preference)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const

export { gsap, ScrollTrigger, useGSAP }
