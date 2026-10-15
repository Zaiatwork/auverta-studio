import Link from 'next/link'

// Closing call to action shared by every inner page.
export default function CtaBand({
  title = (
    <>
      Ready to go <em>beyond ordinary?</em>
    </>
  ),
  body = 'Tell us where you are and where you want to be. We reply within one working day with a clear next step.',
}: {
  title?: React.ReactNode
  body?: string
}) {
  return (
    <section className="section cta-band" aria-labelledby="cta-band-title">
      <div className="container">
        <span className="cta-band__rule" data-line aria-hidden="true" />
        <div className="cta-band__grid">
          <h2 className="cta-band__title" id="cta-band-title" data-reveal>
            {title}
          </h2>
          <div className="cta-band__side" data-reveal>
            <p className="section-subtitle">{body}</p>
            <Link href="/contact/" className="btn btn--primary btn--lg" data-cursor="start">
              Start a project
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
