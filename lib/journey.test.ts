import { describe, expect, it } from 'vitest'
import { emptyState, sampleJourney, sanitize, type Keyframe } from './journey'

const key = (at: number, x: number): Keyframe => {
  const s = emptyState()
  s.L.x = x
  s.R.x = x
  return { at, state: s, ease: 'none' }
}

describe('sanitize', () => {
  it('makes anchors strictly increasing', () => {
    const keys = sanitize([key(100, 0), key(100, 0), key(50, 0)])
    expect(keys.map((k) => k.at)).toEqual([100, 101, 102])
  })
})

describe('sampleJourney', () => {
  const keys = [key(0, 0), key(100, 1)]

  it('returns the first key at scroll 0 and the last key past the end', () => {
    expect(sampleJourney(keys, 0, emptyState()).L.x).toBe(0)
    expect(sampleJourney(keys, 5000, emptyState()).L.x).toBe(1)
  })

  it('interpolates between keys', () => {
    expect(sampleJourney(keys, 50, emptyState()).R.x).toBeCloseTo(0.5)
  })
})