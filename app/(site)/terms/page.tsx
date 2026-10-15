import type { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import { CONTACT_EMAIL } from '@/lib/config/env'
import { LEGAL_UPDATED } from '@/lib/pages'

export const metadata: Metadata = {
  title: 'Terms | Auverta',
  description: 'The terms that apply when you use the Auverta website.',
  alternates: { canonical: '/terms/' },
}

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title={<>Terms of <em>use.</em></>} lead={`Last updated ${LEGAL_UPDATED}.`} />
      <section className="section section--tight">
        <div className="container">
          <div className="prose prose--legal">
            <h2>Using this site</h2>
            <p>
              By using auverta.studio you agree to these terms. The site is provided for information about our
              services. Please do not misuse it, attempt to disrupt it or submit unlawful content through its forms.
            </p>
            <h2>Our content</h2>
            <p>
              The text, design, imagery and code on this site belong to Auverta or its licensors. You may not copy or
              republish them without written permission.
            </p>
            <h2>Enquiries are not contracts</h2>
            <p>
              Sending a brief does not create an agreement. Any work is governed by a separate written proposal or
              contract agreed by both parties.
            </p>
            <h2>No warranty</h2>
            <p>
              We work to keep the information here accurate and the site available, but we provide it as is and do not
              guarantee it is error free or uninterrupted.
            </p>
            <h2>Changes and contact</h2>
            <p>
              We may update these terms from time to time. Questions can be sent to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
