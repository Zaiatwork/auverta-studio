'use client'

import { useEffect } from 'react'
import Link from 'next/link'

// Catches render errors in any route below the root layout and offers a retry.
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="page-hero" style={{ minHeight: '100vh' }}>
      <div className="container">
        <p className="section-eyebrow">Error</p>
        <h1 className="page-hero__title">
          Something <em>broke.</em>
        </h1>
        <p className="page-hero__lead">This page failed to load. Try again, or head back home.</p>
        <p style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn--primary" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="btn">
            Back home
          </Link>
        </p>
      </div>
    </main>
  )
}
