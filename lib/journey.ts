'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * The Auverta icon journey: one choreography from the hero to the footer.
 *
 * Positions are in viewport space: x and y run from -1 to 1 (y up), `s` is the
 * mark's height as a fraction of the viewport height. Each half of the mark
 * (L, R) moves independently; when both share the same values they form the
 * complete mark. Keyframes are anchored to scroll positions measured from the
 * live layout (including pinned sections), and rebuilt on every ScrollTrigger
 * refresh, so the choreography stays attached to the sections it frames.
 */

export type Half = { x: number; y: number; s: number; r: number; o: number }
export type JourneyState = { L: Half; R: Half; yaw: number; pitch: number; tilt: number }
export type Keyframe = { at: number; state: JourneyState; ease?: string }

export const MARK_ASPECT = 297 / 262 // width / height of the mark's outline (from the SVG)

const joined = (x: number, y: number, s: number, r = 0, o = 1): { L: Half; R: Half } => ({
  L: { x, y, s, r, o },
  R: { x, y, s, r, o },
})

const pose = (yaw: number, pitch: number, tilt: number) => ({ yaw, pitch, tilt })

const docTop = (sel: string) => {
  const el = document.querySelector<HTMLElement>(sel)
  return el ? el.getBoundingClientRect().top + window.scrollY : 0
}
const docHeight = (sel: string) => document.querySelector<HTMLElement>(sel)?.offsetHeight ?? 0

/** Where the footer lockup placeholder sits (in viewport space) when the page is fully scrolled. */
function footerTarget(maxScroll: number) {
  const el = document.querySelector<HTMLElement>('[data-journey-target]')
  const vw = window.innerWidth
  const vh = window.innerHeight
  if (!el) return { x: 0, y: -0.8, s: 0.08 }
  const r = el.getBoundingClientRect()
  const top = r.top + window.scrollY - maxScroll
  return {
    x: ((r.left + r.width / 2) / vw) * 2 - 1,
    y: 1 - ((top + r.height / 2) / vh) * 2,
    s: (r.height / vh) * 0.9,
  }
}

/** The hero composition, matching the original hero layout for each orientation. */
function heroPose() {
  const aspect = window.innerWidth / window.innerHeight
  if (aspect < 1) {
    // Portrait: upper area, clear of the bottom-aligned headline.
    const s = Math.min(0.14 * 5.096 * aspect, 0.62) * (3.07 / 5.096)
    return joined(0.2, 1 - s - 0.17, s)
  }
  return joined(aspect < 1.5 ? 0.54 : 0.5, 0.02, 0.42)
}

/** Desktop: the full journey, with the Showcase frame and the portfolio hand-off. */
function desktopKeys(): Keyframe[] {
  const vh = window.innerHeight
  const vw = window.innerWidth
  const max = ScrollTrigger.maxScroll(window)

  const eq = ScrollTrigger.getById('eq-pin')
  const work = ScrollTrigger.getById('work-pin')
  const proc = ScrollTrigger.getById('process-pin')

  const aboutTop = docTop('#about')
  const servicesTop = docTop('#services')
  const workStart = work ? work.start : docTop('#work')
  const workEnd = work ? work.end : workStart + docHeight('#work')
  const workHold = vh * 0.55 // matches the intro hold in Work.tsx
  const whyTop = docTop('#why')
  const procStart = proc ? proc.start : docTop('#process')
  const procEnd = proc ? proc.end : procStart + docHeight('#process')
  const ctaTop = docTop('.cta')
  const ctaMid = ctaTop + (docHeight('.cta') - vh) / 2
  const contactTop = docTop('#contact')
  const footerTop = docTop('.footer')
  const lock = footerTarget(max)

  const eqStart = eq ? eq.start : aboutTop + vh
  const eqEnd = eq ? eq.end : eqStart + vh

  // Visible states are fully solid: a half-transparent glossy mark reads as grey plastic.
  // Where copy is dense the halves stay in clear space or sit partly off-screen at the edges.
  const keys: Keyframe[] = [
    // Hero: the complete mark, right of the headline.
    { at: 0, state: { ...heroPose(), ...pose(-0.35, 0.12, 1) } },
    // Leaving the hero: the halves part and head for opposite edges.
    {
      at: vh * 0.45,
      state: {
        L: { x: 0.18, y: 0.42, s: 0.34, r: 0.2, o: 1 },
        R: { x: 0.9, y: -0.12, s: 0.36, r: 0.12, o: 1 },
        ...pose(-0.1, 0.1, 0.8),
      },
    },
    // Positioning statement: parked at the edges, mostly off-screen, framing the copy.
    {
      at: aboutTop,
      state: {
        L: { x: -1.22, y: 0.72, s: 0.3, r: 0.25, o: 1 },
        R: { x: 1.2, y: -0.55, s: 0.32, r: 0.2, o: 1 },
        ...pose(0.2, 0.05, 0.5),
      },
    },
    // The equation (pinned): tips enter from the top-left and bottom-right corners, clear of the words and notes.
    {
      at: eqStart,
      state: {
        L: { x: -0.92, y: 1.1, s: 0.3, r: 0.95, o: 1 },
        R: { x: 0.92, y: -1.1, s: 0.3, r: 0.75, o: 1 },
        ...pose(0.1, 0.05, 0.4),
      },
    },
    { at: eqEnd - vh * 1.1, state: {
        L: { x: -0.92, y: 1.1, s: 0.3, r: 0.95, o: 1 },
        R: { x: 0.92, y: -1.1, s: 0.3, r: 0.75, o: 1 },
        ...pose(0.1, 0.05, 0.4),
      },
    },
    // "Together, that's Auverta": with the words faded, the halves close in to flank the wordmark.
    {
      at: eqEnd - vh * 0.15,
      state: {
        L: { x: -0.74, y: 0.02, s: 0.34, r: 0.05, o: 1 },
        R: { x: 0.74, y: -0.02, s: 0.34, r: 0.05, o: 1 },
        ...pose(0, 0.04, 0.4),
      },
    },
    // Services: back out to the edges, behind the list and the image panel.
    {
      at: servicesTop,
      state: {
        L: { x: -1.14, y: 0.35, s: 0.28, r: 0.3, o: 1 },
        R: { x: 1.14, y: -0.3, s: 0.3, r: 0.2, o: 1 },
        ...pose(0.15, 0.05, 0.4),
      },
    },
    // Approaching the Showcase: the halves gather just off the right edge.
    {
      at: workStart - vh * 0.75,
      state: {
        L: { x: 1.15, y: 0.55, s: 0.26, r: 0.25, o: 1 },
        R: { x: 1.3, y: -0.1, s: 0.55, r: 0.1, o: 1 },
        ...pose(0.05, 0.05, 0.3),
      },
    },
    // "Work in focus": one half sweeps in and expands to frame the right side of the screen.
    {
      at: workStart,
      state: {
        L: { x: 1.2, y: 1.4, s: 0.26, r: 0.3, o: 0 },
        R: { x: 0.56, y: 0.04, s: 1.08, r: 0, o: 1 },
        ...pose(0, 0, 0.25),
      },
      ease: 'power3.inOut',
    },
    // Held while the section is presented.
    {
      at: workStart + workHold,
      state: {
        L: { x: 1.2, y: 1.4, s: 0.26, r: 0.3, o: 0 },
        R: { x: 0.54, y: 0.03, s: 1.05, r: 0, o: 1 },
        ...pose(0, 0, 0.25),
      },
    },
    // The portfolio slides in: the frame leaves to the left with the intro, like part of the
    // first slide, shrinking as it goes so it is clear of the first card before the card arrives.
    {
      at: workStart + workHold + vw * 0.7,
      state: {
        L: { x: -1.4, y: 1.4, s: 0.26, r: 0.3, o: 0 },
        R: { x: -1.7, y: 0.05, s: 0.6, r: -0.1, o: 1 },
        ...pose(0, 0, 0.25),
      },
      ease: 'none',
    },
    // Hidden while the cards travel (it would only sit behind them).
    {
      at: workStart + workHold + vw * 1.05,
      state: { ...joined(-1.55, 0.03, 0.3, -0.1, 0), ...pose(0, 0, 0.3) },
    },
    { at: workEnd - vh * 0.45, state: { ...joined(1.4, 0.3, 0.18, 0.4, 0), ...pose(-0.2, 0.08, 0.5) } },
    // End of the portfolio: the mark re-enters from the right, complete again, following the travel.
    { at: workEnd, state: { ...joined(1.02, 0.25, 0.18, 0.4, 1), ...pose(-0.2, 0.08, 0.5) } },
    // Why Auverta: resting on the right edge, clear of the heading, map and values.
    { at: whyTop + vh * 0.4, state: { ...joined(1.06, -0.05, 0.2, -0.3, 1), ...pose(0.25, 0.08, 0.5) } },
    // Process (pinned): travels along the top edge, against the horizontal movement
    // (entering from the right keeps it clear of the heading on the left).
    { at: procStart, state: { ...joined(0.86, 0.88, 0.09, 0.2, 1), ...pose(-0.2, 0.05, 0.4) } },
    { at: procEnd, state: { ...joined(-0.86, 0.88, 0.09, -0.6, 1), ...pose(0.2, 0.05, 0.4) } },
    // Final CTA: settles below the buttons, the headline left clear.
    { at: ctaMid, state: { ...joined(0, -0.62, 0.12, 0, 1), ...pose(-0.15, 0.1, 0.5) } },
    // Contact: zooms out and drifts to the right edge, beside the form.
    { at: contactTop + vh * 0.3, state: { ...joined(1.0, 0.05, 0.1, 0.2, 1), ...pose(0.2, 0.05, 0.3) } },
    // Footer comes into view: descends towards the lockup.
    {
      at: Math.max(footerTop - vh, contactTop + vh * 0.35),
      state: { ...joined(0.55, -0.35, 0.1, 0.1, 1), ...pose(0.1, 0.03, 0.2) },
    },
    // Settled: the mark sits in the footer lockup, face-on.
    { at: max, state: { ...joined(lock.x, lock.y, lock.s, 0, 1), ...pose(0, 0, 0) }, ease: 'power2.out' },
  ]
  return sanitize(keys)
}

/** Tablet and phone: a simplified journey along the right edge, still ending in the footer. */
function compactKeys(): Keyframe[] {
  const vh = window.innerHeight
  const max = ScrollTrigger.maxScroll(window)
  const footerTop = docTop('.footer')
  const lock = footerTarget(max)
  // Solid, and mostly off the right edge so it never sits over text on narrow screens.
  const edge = (y: number, r: number, o = 1) => ({ ...joined(1.1, y, 0.1, r, o), ...pose(0, 0.05, 0) })

  const keys: Keyframe[] = [
    { at: 0, state: { ...heroPose(), ...pose(-0.3, 0.1, 0) } },
    { at: vh * 0.8, state: edge(0.62, 0.3) },
    { at: docTop('#about'), state: edge(-0.6, 0.8) },
    { at: docTop('#services'), state: edge(0.6, 1.3) },
    // Showcase: one half grows along the right edge while the title is on screen.
    {
      at: docTop('#work'),
      state: {
        L: { x: 0.8, y: -0.8, s: 0.1, r: 1.3, o: 0 },
        R: { x: 1.15, y: 0.4, s: 0.36, r: 0, o: 1 },
        ...pose(0, 0, 0),
      },
    },
    { at: docTop('#why'), state: edge(-0.62, 1.8) },
    { at: docTop('#process'), state: edge(0.62, 2.3) },
    { at: docTop('#contact'), state: edge(-0.6, 2.8) },
    { at: Math.max(footerTop - vh, docTop('#contact') + 10), state: { ...joined(0.3, -0.4, 0.09, 0.2, 0.9), ...pose(0, 0, 0) } },
    { at: max, state: { ...joined(lock.x, lock.y, lock.s, 0, 1), ...pose(0, 0, 0) }, ease: 'power2.out' },
  ]
  return sanitize(keys)
}

/** Keep anchors strictly increasing, so a short page or odd layout never breaks interpolation. */
function sanitize(keys: Keyframe[]) {
  for (let i = 1; i < keys.length; i++) {
    if (keys[i].at <= keys[i - 1].at) keys[i].at = keys[i - 1].at + 1
  }
  return keys
}

export function buildKeyframes(mode: 'desktop' | 'compact') {
  return mode === 'desktop' ? desktopKeys() : compactKeys()
}

const easeCache = new Map<string, (t: number) => number>()
const getEase = (name = 'power1.inOut') => {
  let fn = easeCache.get(name)
  if (!fn) {
    fn = gsap.parseEase(name) as (t: number) => number
    easeCache.set(name, fn)
  }
  return fn
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpHalf = (a: Half, b: Half, t: number, out: Half) => {
  out.x = lerp(a.x, b.x, t)
  out.y = lerp(a.y, b.y, t)
  out.s = lerp(a.s, b.s, t)
  out.r = lerp(a.r, b.r, t)
  out.o = lerp(a.o, b.o, t)
}

/** The journey state for a scroll position (writes into `out` to avoid allocations per frame). */
export function sampleJourney(keys: Keyframe[], scroll: number, out: JourneyState) {
  if (!keys.length) return out
  let i = 0
  while (i < keys.length - 2 && scroll > keys[i + 1].at) i++
  const a = keys[i]
  const b = keys[Math.min(i + 1, keys.length - 1)]
  const span = b.at - a.at
  const raw = span > 0 ? Math.min(1, Math.max(0, (scroll - a.at) / span)) : 1
  const t = getEase(b.ease)(raw)
  lerpHalf(a.state.L, b.state.L, t, out.L)
  lerpHalf(a.state.R, b.state.R, t, out.R)
  out.yaw = lerp(a.state.yaw, b.state.yaw, t)
  out.pitch = lerp(a.state.pitch, b.state.pitch, t)
  out.tilt = lerp(a.state.tilt, b.state.tilt, t)
  return out
}

export const emptyState = (): JourneyState => ({
  L: { x: 0, y: 0, s: 0, r: 0, o: 0 },
  R: { x: 0, y: 0, s: 0, r: 0, o: 0 },
  yaw: 0,
  pitch: 0,
  tilt: 0,
})
