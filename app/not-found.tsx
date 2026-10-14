import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="page-hero" style={{ minHeight: '100vh' }}>
      <div className="container">
        <p className="section-eyebrow">404</p>
        <h1 className="page-hero__title">
          Off the <em>map.</em>
        </h1>
        <p className="page-hero__lead">That page does not exist or has moved.</p>
        <p style={{ marginTop: '2rem' }}>
          <Link href="/" className="btn btn--primary">
            Back home
          </Link>
        </p>
      </div>
    </main>
  )
}
