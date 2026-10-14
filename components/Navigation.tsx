'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { CONTACT_EMAIL, NAV_LINKS } from '@/lib/content'
import { getLenis } from '@/lib/scroll'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  // Floating bar after leaving the top; hide while scrolling down, reveal on scroll up.
  // The hairline under the bar tracks the journey's progress from hero to footer.
  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false
    const update = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      headerRef.current?.style.setProperty('--progress', String(max > 0 ? Math.min(1, y / max) : 0))
      setScrolled(y > 40)
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > window.innerHeight * 0.6)
        lastY = y
      }
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section currently in view.
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // Mobile menu: lock scroll, close on Escape, return focus to the toggle.
  useEffect(() => {
    const lenis = getLenis()
    if (mobileOpen) {
      lenis?.stop()
      document.documentElement.classList.add('menu-open')
    } else {
      lenis?.start()
      document.documentElement.classList.remove('menu-open')
    }
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const closeMenu = () => setMobileOpen(false)

  return (
    <>
      <header
        ref={headerRef}
        className={`nav${scrolled ? ' is-scrolled' : ''}${hidden && !mobileOpen ? ' is-hidden' : ''}${mobileOpen ? ' is-open' : ''}`}
      >
        <div className="container nav__inner">
          <a href="#top" className="nav__logo" aria-label="Auverta, back to top" onClick={closeMenu}>
            <Image src="/brand/auverta-logo-white.png" alt="Auverta" width={1534} height={288} preload className="logo-img" />
          </a>

          <nav aria-label="Main">
            <ul className="nav__links">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`nav__link${active === link.href ? ' is-active' : ''}`}
                    aria-current={active === link.href ? 'true' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav__actions">
            <ThemeToggle />
            <a href="#contact" className="nav__cta" data-cursor="start">
              Start a project
            </a>
          </div>

          <button
            ref={toggleRef}
            className={`nav__hamburger${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
          </button>
          <span className="nav__progress" aria-hidden="true" />
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`nav__mobile${mobileOpen ? ' open' : ''}`}
        inert={!mobileOpen}
        aria-label="Mobile navigation"
      >
        <ul className="nav__mobile-links">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} style={{ '--i': i } as React.CSSProperties}>
              <a href={link.href} className="nav__mobile-link" onClick={closeMenu}>
                <span className="nav__mobile-index">0{i + 1}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav__mobile-footer">
          <a href="#contact" className="btn btn--primary" onClick={closeMenu}>
            Start a project <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="nav__mobile-mail">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </>
  )
}
