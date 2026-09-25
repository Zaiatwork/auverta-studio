'use client'

import dynamic from 'next/dynamic'

// WebGL is client-only and non-critical: it loads after the headline paints.
const JourneyScene = dynamic(() => import('./JourneyScene'), { ssr: false, loading: () => null })

/**
 * The travelling Auverta mark: a fixed layer painted behind all page content
 * (z-index -1, pointer-events none), so it can never cover text or block clicks.
 */
export default function IconJourney() {
  return (
    <div className="journey" aria-hidden="true">
      <JourneyScene />
    </div>
  )
}
