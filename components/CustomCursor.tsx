'use client'

import { useEffect, useRef } from 'react'

const LABELS: Record<string, string> = {
  view: 'View',
  explore: 'Explore',
  start: 'Start',
}

/**
 * Desktop-only cursor. States are driven by a `data-cursor` attribute on any
 * element ("view" | "explore" | "start"); plain links/buttons get a hover ring.
 * The native cursor is only hidden while this component is active, and text
 * fields always keep the native caret.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!cursor || !dot || !ring || !label) return

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const html = document.documentElement
    html.classList.add('has-cursor')

    let mx = -100
    let my = -100
    let rx = mx
    let ry = my
    let raf = 0
    let visible = false

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      if (!visible) {
        visible = true
        rx = mx
        ry = my
        cursor.classList.add('is-visible')
      }
    }

    const loop = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const setState = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null
      const field = el?.closest('input, textarea, select, [contenteditable="true"]')
      const labelled = el?.closest<HTMLElement>('[data-cursor]')
      const interactive = el?.closest('a, button, [role="button"], label')

      cursor.classList.toggle('is-hidden', !!field)
      const state = labelled?.dataset.cursor
      if (state && LABELS[state]) {
        cursor.dataset.state = 'label'
        label.textContent = LABELS[state]
      } else {
        cursor.dataset.state = interactive ? 'hover' : ''
      }
    }

    const onOver = (e: PointerEvent) => setState(e.target)
    const onLeave = () => {
      visible = false
      cursor.classList.remove('is-visible')
    }
    const onDown = () => cursor.classList.add('is-pressed')
    const onUp = () => cursor.classList.remove('is-pressed')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    return () => {
      cancelAnimationFrame(raf)
      html.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return (
    <div ref={cursorRef} className="cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor__ring">
        <span ref={labelRef} className="cursor__label" />
      </div>
      <div ref={dotRef} className="cursor__dot" />
    </div>
  )
}
