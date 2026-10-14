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

/**
 * The split pair. One rule holds for the whole journey, hero to footer: the two pieces
 * (A = left stroke, B = right stroke) share one scale and one rotation, B always trails
 * A diagonally down-and-right, and neither is ever hidden. Only the pair's position,
 * spread, scale and a gentle rotation change with scroll, so every section reads as
 * the same two objects continuing on their way. They only rejoin inside the footer.
 */
const pair = (ax: number, ay: number, bx: number, by: number, s: number, r: number) => ({
  L: { x: ax, y: ay, s, r, o: 1 },
  R: { x: bx, y: by, s, r, o: 1 },
})

/** Desktop: the full journey, with the portfolio set inside the enlarged mark. */
function desktopKeys(): Keyframe[] {
  const vh = window.innerHeight
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
  const travel = (from: number, to: number, t: number) => from + (to - from) * t

  const keys: Keyframe[] = [
    // Hero: the mark, its two strokes composed right of the headline.
    { at: 0, state: { ...heroPose(), ...pose(-0.35, 0.12, 1) } },
    // Scrolling begins: the pieces part along the diagonal and set off.
    { at: vh * 0.45, state: { ...pair(0.22, 0.34, 0.86, -0.12, 0.34, 0.12), ...pose(-0.1, 0.1, 0.8) } },
    // Positioning: the pair spans the page, A high on the left edge, B low on the right.
    { at: aboutTop, state: { ...pair(-1.1, 0.7, 1.04, -0.55, 0.31, 0.22), ...pose(0.15, 0.05, 0.5) } },
    // The equation (pinned): the pair opens to the corners, clear of the words and notes.
    { at: eqStart, state: { ...pair(-0.94, 1.08, 0.94, -1.08, 0.3, 0.32), ...pose(0.1, 0.05, 0.4) } },
    { at: eqEnd - vh * 1.1, state: { ...pair(-0.9, 1.05, 0.9, -1.05, 0.3, 0.26), ...pose(0.1, 0.05, 0.4) } },
    // "Together, that's Auverta": the words fade and the pair closes in on the wordmark.
    { at: eqEnd - vh * 0.15, state: { ...pair(-0.76, 0.12, 0.76, -0.12, 0.34, 0.08), ...pose(0, 0.04, 0.4) } },
    // Services: back out to the edges, behind the list and the image panel.
    { at: servicesTop, state: { ...pair(-1.02, 0.45, 1.02, -0.35, 0.3, 0.2), ...pose(0.12, 0.05, 0.4) } },
    { at: workStart - vh * 1.2, state: { ...pair(-1.02, 0.5, 1.02, -0.3, 0.3, 0.18), ...pose(0.1, 0.05, 0.4) } },
    // A rises straight up the left margin first...
    { at: workStart - vh * 0.9, state: { ...pair(-1.14, 1.22, 1.02, -0.22, 0.34, 0.16), ...pose(0.08, 0.05, 0.38) } },
    // ...then, approaching the Showcase, crosses along the very top edge (clear of the services copy)
    // while B holds the right edge; both start to grow.
    { at: workStart - vh * 0.6, state: { ...pair(0.2, 1.24, 1.02, -0.12, 0.42, 0.14), ...pose(0.05, 0.05, 0.35) } },
    // "Work in focus": the pair has grown into a large, still legible mark, the environment
    // the portfolio will appear in. It stays right of the title, which keeps clear space.
    { at: workStart, state: { ...pair(0.47, 0.08, 0.66, -0.03, 0.86, 0.04), ...pose(0, 0.02, 0.3) }, ease: 'power2.inOut' },
    { at: workStart + workHold, state: { ...pair(0.43, 0.07, 0.63, -0.04, 0.86, 0.02), ...pose(0, 0.02, 0.3) } },
    // Portfolio: the cards travel across in front while the pair keeps drifting behind them,
    // slower and in the same direction, on the same scroll: two layers, one movement.
    {
      at: travel(workStart + workHold, workEnd, 0.5),
      state: { ...pair(0.02, 0.1, 0.24, -0.06, 0.82, -0.04), ...pose(0.03, 0.03, 0.3) },
    },
    {
      at: travel(workStart + workHold, workEnd, 0.8),
      state: { ...pair(-0.34, 0.12, -0.12, -0.08, 0.76, -0.08), ...pose(0.06, 0.03, 0.3) },
    },
    // Last cards: while they still cover the middle, the same pair shrinks and spreads back
    // out to the edges on its diagonal, so the next section opens on clear space.
    { at: workEnd, state: { ...pair(-1.02, 0.5, 1.02, -0.4, 0.32, -0.04), ...pose(0.1, 0.05, 0.4) } },
    { at: whyTop + vh * 0.4, state: { ...pair(-1.0, 0.46, 1.0, -0.36, 0.3, 0.02), ...pose(0.12, 0.06, 0.4) } },
    // Process (pinned): the pair opens to the corners again and drifts with the horizontal travel.
    // A stays just off the left edge until the heading has scrolled away, then eases into its corner.
    { at: procStart, state: { ...pair(-1.02, 0.92, 1.02, -0.95, 0.26, 0.1), ...pose(0.1, 0.05, 0.35) } },
    { at: procEnd, state: { ...pair(-0.9, 1.0, 0.9, -1.0, 0.26, 0.22), ...pose(-0.1, 0.05, 0.35) } },
    // Final CTA: the pair flanks the headline from the edges.
    { at: ctaMid, state: { ...pair(-1.0, 0.38, 1.0, -0.38, 0.28, 0.14), ...pose(0, 0.05, 0.3) } },
    // Contact: calmer now, a little smaller, still on its diagonal.
    { at: contactTop + vh * 0.3, state: { ...pair(-1.0, 0.5, 1.0, -0.44, 0.22, 0.08), ...pose(0.05, 0.04, 0.2) } },
    // Footer approaches: the pieces slow, scale down and sink to the bottom corners...
    {
      at: Math.max(footerTop - vh, contactTop + vh * 0.35),
      state: { ...pair(-0.96, -0.92, 0.96, -1.04, 0.14, 0.04), ...pose(0.03, 0.02, 0.15) },
    },
    // ...then close in beneath the lockup slot and rise into it together with the footer,
    // staying below the footer copy the whole way (the slot is 0.25vh lower at this point).
    {
      at: max - vh * 0.25,
      state: {
        ...pair(lock.x - 0.05, lock.y - 0.5, lock.x + 0.12, lock.y - 0.58, lock.s * 1.1, 0.02),
        ...pose(0.02, 0.01, 0.05),
      },
    },
    // Settled: the two pieces finally rejoin, face-on, in the footer lockup.
    { at: max, state: { ...joined(lock.x, lock.y, lock.s, 0, 1), ...pose(0, 0, 0) }, ease: 'power2.out' },
  ]
  return sanitize(keys)
}

/** Tablet and phone: the same split pair on a simpler path along the edges, ending in the footer. */
function compactKeys(): Keyframe[] {
  const vh = window.innerHeight
  const max = ScrollTrigger.maxScroll(window)
  const footerTop = docTop('.footer')
  const workTop = docTop('#work')
  const lock = footerTarget(max)
  // Mostly off-screen tips on narrow screens, so they never sit over text.
  const edges = (tilt: number, r: number) => ({ ...pair(-1.12, 0.6 + tilt, 1.12, -0.5 + tilt, 0.1, r), ...pose(0, 0.05, 0) })

  const keys: Keyframe[] = [
    { at: 0, state: { ...heroPose(), ...pose(-0.3, 0.1, 0) } },
    { at: vh * 0.8, state: edges(0, 0.2) },
    { at: docTop('#about'), state: edges(-0.1, 0.35) },
    { at: docTop('#services'), state: edges(0.05, 0.5) },
    // Portfolio: the pair grows behind the swipeable cards, then carries on.
    { at: workTop, state: { ...pair(-0.75, 0.35, 0.95, -0.15, 0.28, 0.2), ...pose(0, 0.02, 0) } },
    { at: workTop + docHeight('#work') - vh * 0.6, state: { ...pair(-0.9, 0.2, 1.0, -0.3, 0.28, 0.1), ...pose(0, 0.02, 0) } },
    { at: docTop('#why'), state: edges(0, 0.25) },
    { at: docTop('#process'), state: edges(-0.08, 0.4) },
    { at: docTop('#contact'), state: edges(0.04, 0.3) },
    { at: Math.max(footerTop - vh, docTop('#contact') + 10), state: { ...pair(-1.0, -0.9, 1.0, -1.02, 0.09, 0.05), ...pose(0, 0, 0) } },
    { at: max - vh * 0.25, state: { ...pair(lock.x - 0.06, lock.y - 0.5, lock.x + 0.14, lock.y - 0.56, lock.s * 1.1, 0.02), ...pose(0, 0, 0) } },
    { at: max, state: { ...joined(lock.x, lock.y, lock.s, 0, 1), ...pose(0, 0, 0) }, ease: 'power2.out' },
  ]
  return sanitize(keys)
}

/** Keep anchors strictly increasing, so a short page or odd layout never breaks interpolation. */
export function sanitize(keys: Keyframe[]) {
  for (let i = 1; i < keys.length; i++) {
    if (keys[i].at <= keys[i - 1].at) keys[i].at = keys[i - 1].at + 1
  }
  return keys
}

export function buildKeyframes(mode: 'desktop' | 'compact') {
  return mode === 'desktop' ? desktopKeys() : compactKeys()
}

const easeCache = new Map<string, (t: number) => number>()
const getEase = (name = 'sine.inOut') => {
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
