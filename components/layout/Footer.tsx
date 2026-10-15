import Link from 'next/link'
import { NAV_LINKS, SOCIALS } from '@/lib/content'
import { CONTACT_EMAIL } from '@/lib/config/env'
import FooterLockup from '@/components/layout/FooterLockup'

// The final stage of the scroll story: the journey mark settles into the lockup here.
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <p className="footer__statement">A creative technology and digital growth studio.</p>
            <p className="footer__tagline">Strategy × Design × Technology × AI × Growth</p>
          </div>

          <nav aria-label="Footer">
            <ul className="footer__links">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer__link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__contact">
            <p className="footer__label">Start a project</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="footer__email">
              {CONTACT_EMAIL}
            </a>
            <ul className="footer__socials">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="footer__social" target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FooterLockup />

        <div className="footer__bottom">
          <p>© 2026 auverta.studio</p>
          <p className="footer__legal">
            <Link href="/privacy/">Privacy</Link>
            <Link href="/terms/">Terms</Link>
          </p>
          <a href="#top" className="footer__top-link">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
