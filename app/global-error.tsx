'use client'

// Last resort when the root layout itself fails; it replaces the whole document, so no site CSS is available.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '4rem 1.5rem' }}>
        <h1>Something went wrong.</h1>
        <p>Please reload the page.</p>
        <button type="button" onClick={reset}>
          Try again
        </button>
      </body>
    </html>
  )
}
