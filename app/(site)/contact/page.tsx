import type { Metadata } from 'next'
import Contact from '@/components/Contact'

export const metadata: Metadata = {
  title: 'Contact | Auverta',
  description: 'Start a project with Auverta. Send a brief and we reply within one working day.',
  alternates: { canonical: '/contact/' },
}

// The form section already carries its own heading, so the page is the section itself.
export default function ContactPage() {
  return (
    <div className="contact-page">
      <Contact asPageTitle />
    </div>
  )
}
