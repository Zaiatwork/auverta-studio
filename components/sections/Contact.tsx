'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, useGSAP, MQ } from '@/lib/gsap'
import { SERVICES, SOCIALS } from '@/lib/content'
import { CONTACT_EMAIL } from '@/lib/config/env'
import { useContactForm } from '@/hooks/useContactForm'

// Presentation only: submission lives in useContactForm → lib/api/contact (PHP endpoint, no Node).
export default function Contact({ asPageTitle = false }: { asPageTitle?: boolean }) {
  const Title = asPageTitle ? 'h1' : 'h2'
  const root = useRef<HTMLElement>(null)
  const { status, submit } = useContactForm()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          '.contact__intro > *',
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, stagger: 0.1, scrollTrigger: { trigger: '.contact__grid', start: 'top 78%' } }
        )
        gsap.fromTo(
          '.contact__form .form-group, .contact__form .form-submit',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, stagger: 0.06, scrollTrigger: { trigger: '.contact__form', start: 'top 80%' } }
        )
        gsap.fromTo(
          '.contact__visual img',
          { scale: 1.2 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: '.contact__visual', start: 'top bottom', end: 'bottom top', scrub: true } }
        )
      })
    },
    { scope: root }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void submit(e.currentTarget)
  }

  return (
    <section ref={root} className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__intro">
          <p className="section-eyebrow">Contact</p>
          <Title className="section-title" id="contact-title">
            Start a <em>project.</em>
          </Title>
          <p className="contact__lead">
            Tell us where you are and where you want to be. We&apos;ll come back with a clear next step.
          </p>

          <div className="contact__visual" aria-hidden="true">
            <Image src="/images/contact.webp" alt="" fill sizes="(max-width: 1024px) 90vw, 40vw" />
          </div>

          <dl className="contact__details">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline">
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </div>
            <div>
              <dt>Follow</dt>
              <dd className="contact__socials">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline">
                    {s.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <form className="contact__form" onSubmit={handleSubmit} noValidate aria-describedby="form-status">
          <div className="form-grid">
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
              <label htmlFor="website">Leave this empty</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <input className="form-input" id="name" name="name" autoComplete="name" required placeholder="Your name" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                className="form-input"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@company.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="company">
                Company <span className="form-optional">(optional)</span>
              </label>
              <input className="form-input" id="company" name="company" autoComplete="organization" placeholder="Company name" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="service">
                Interested in
              </label>
              <select className="form-select" id="service" name="service" defaultValue={SERVICES[0].title}>
                {SERVICES.map((s) => (
                  <option key={s.number}>{s.title}</option>
                ))}
                <option>Not sure yet</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label className="form-label" htmlFor="message">
                Project details
              </label>
              <textarea
                className="form-textarea"
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Goals, timeline, anything we should know"
              />
            </div>
          </div>

          <div className="form-submit">
            <button type="submit" className="btn btn--primary" data-cursor="start" disabled={status.kind === 'sending'}>
              Send brief
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </button>
            <p
              id="form-status"
              className={`form-note${status.kind === 'error' ? ' is-error' : ''}`}
              role="status"
              aria-live="polite"
            >
              {status.message ?? 'We reply within one working day.'}
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
