import type { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import { CONTACT_EMAIL } from '@/lib/config/env'
import { LEGAL_UPDATED } from '@/lib/pages'

export const metadata: Metadata = {
  title: 'Privacy | Auverta',
  description: 'How Auverta collects, uses and protects the information you send through this site.',
  alternates: { canonical: '/privacy/' },
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title={<>Privacy <em>policy.</em></>} lead={`Last updated ${LEGAL_UPDATED}.`} />
      <section className="section section--tight">
        <div className="container">
          <div className="prose prose--legal">
            <h2>What we collect</h2>
            <p>
              When you send a brief through the contact form we collect your name, email address, company (optional),
              the service you are interested in and your message. To protect the form from abuse we also store a
              one-way hash of your IP address and your browser&apos;s user agent string. We do not store your raw IP
              address.
            </p>
            <h2>How we use it</h2>
            <p>
              We use this information to reply to your enquiry and to prevent spam. We do not sell your data and we do
              not use it for advertising.
            </p>
            <h2>Where it is stored</h2>
            <p>
              Enquiries are stored in a database on our web host, Hostinger, and sent to our email inbox. Access is
              limited to the Auverta team.
            </p>
            <h2>How long we keep it</h2>
            <p>
              We keep enquiries for as long as needed to respond and to maintain a record of our conversations. Rate
              limiting records are deleted automatically within a day.
            </p>
            <h2>Cookies and analytics</h2>
            <p>
              This site stores your light or dark theme choice in your browser&apos;s local storage. It does not use
              advertising cookies.
            </p>
            <h2>Your rights</h2>
            <p>
              You can ask to see, correct or delete the information we hold about you at any time by emailing{' '}
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
