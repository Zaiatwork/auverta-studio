'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger, useGSAP, MQ } from '@/lib/gsap'
import { SHOWCASE } from '@/lib/content'

// The card visual is 16:10. Images wider than that pan sideways on hover; taller ones
// (e.g. full-page screenshots) scroll down through the page.
const CARD_ASPECT = 16 / 10

export default function Work() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MQ.motion, () => {
        gsap.fromTo(
          '.work__intro > *',
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, stagger: 0.1, scrollTrigger: { trigger: root.current, start: 'top 70%' } }
        )
      })

      // Desktop: the same language as Strategic Process. The section pins, holds on the
      // intro while the icon frames it, then the portfolio travels horizontally.
      mm.add(MQ.desktop, () => {
        const section = root.current!
        section.classList.add('is-pinned')
        const track = section.querySelector<HTMLElement>('.work__track')!
        const intro = section.querySelector<HTMLElement>('.work__intro')!
        const cards = gsap.utils.toArray<HTMLElement>('.pf-card')
        const counter = section.querySelector<HTMLElement>('.work__count-current')!

        const hold = () => window.innerHeight * 0.55 // keep in sync with lib/journey.ts
        const distance = () => track.scrollWidth - window.innerWidth

        const pin = ScrollTrigger.create({
          id: 'work-pin', // the icon journey anchors to this pin
          trigger: '.work__pin',
          start: 'top top',
          end: () => `+=${hold() + distance()}`,
          pin: true,
          invalidateOnRefresh: true,
        })

        let current = -1
        const setActive = (progress: number) => {
          const i = Math.min(cards.length - 1, Math.max(0, Math.floor(progress * cards.length * 1.05 - 0.15)))
          if (i === current) return
          current = i
          cards.forEach((el, j) => el.classList.toggle('is-active', j === i))
          counter.textContent = String(i + 1).padStart(2, '0')
        }

        gsap.to([track, intro], {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.work__pin',
            start: () => pin.start + hold(),
            end: () => pin.start + hold() + distance(),
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set('.work__rail-fill', { scaleX: self.progress })
              setActive(self.progress)
            },
            onRefresh: (self) => setActive(self.progress),
          },
        })

        // Cards ease up into place as they enter from the right.
        cards.forEach((card) => {
          gsap.fromTo(
            card.querySelector('article'),
            { clipPath: 'inset(10% 0% 10% 0% round 12px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 12px)',
              ease: 'none',
              scrollTrigger: {
                trigger: '.work__pin',
                start: () => pin.start + hold() + Math.max(0, card.offsetLeft - window.innerWidth),
                end: () => pin.start + hold() + Math.max(0, card.offsetLeft - window.innerWidth * 0.45),
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          )
        })

        return () => section.classList.remove('is-pinned')
      })

      // Touch / smaller screens: the track is a native swipe scroller; keep the counter and rail in step.
      const viewport = root.current!.querySelector<HTMLElement>('.work__viewport')!
      const count = root.current!.querySelector<HTMLElement>('.work__count-current')!
      const fill = root.current!.querySelector<HTMLElement>('.work__rail-fill')!
      const onSwipe = () => {
        if (root.current!.classList.contains('is-pinned')) return
        const max = viewport.scrollWidth - viewport.clientWidth
        const p = max > 0 ? viewport.scrollLeft / max : 0
        fill.style.transform = `scaleX(${p})`
        count.textContent = String(Math.min(SHOWCASE.length, Math.round(p * (SHOWCASE.length - 1)) + 1)).padStart(2, '0')
      }
      viewport.addEventListener('scroll', onSwipe, { passive: true })

      // Hover preview: the image drifts through the project, like a live preview.
      const cleanups = gsap.utils.toArray<HTMLElement>('.pf-card').map((card) => {
        const frame = card.querySelector<HTMLElement>('.pf-card__frame')!
        const img = card.querySelector<HTMLElement>('.pf-card__img')!
        const axis = card.dataset.pan === 'y' ? 'y' : 'x'
        let loop: gsap.core.Tween | null = null
        const overflow = () =>
          axis === 'x' ? Math.max(0, img.offsetWidth - frame.clientWidth) : Math.max(0, img.offsetHeight - frame.clientHeight)
        const rest = () => (axis === 'x' ? -overflow() / 2 : 0)
        const place = () => gsap.set(img, { [axis]: rest() })
        place()

        const enter = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse' || window.matchMedia(MQ.reduced).matches) return
          const o = overflow()
          if (!o) return
          loop?.kill()
          const secs = Math.max(3, o / 70)
          // Sideways: drift to the start, then glide end to end. Down: scroll the page and back.
          loop = gsap.to(img, {
            [axis]: axis === 'x' ? 0 : -o,
            duration: axis === 'x' ? secs / 2 : secs,
            ease: 'sine.inOut',
            onComplete: () => {
              loop = gsap.to(img, {
                [axis]: axis === 'x' ? -o : 0,
                duration: secs,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                repeatDelay: 0.4,
              })
            },
          })
        }
        const leave = () => {
          loop?.kill()
          loop = gsap.to(img, { [axis]: rest(), duration: 1.1, ease: 'power3.out' })
        }
        card.addEventListener('pointerenter', enter)
        card.addEventListener('pointerleave', leave)
        const onRefresh = () => {
          loop?.kill()
          place()
        }
        ScrollTrigger.addEventListener('refresh', onRefresh)
        return () => {
          loop?.kill()
          card.removeEventListener('pointerenter', enter)
          card.removeEventListener('pointerleave', leave)
          ScrollTrigger.removeEventListener('refresh', onRefresh)
        }
      })

      return () => {
        viewport.removeEventListener('scroll', onSwipe)
        cleanups.forEach((fn) => fn())
      }
    },
    { scope: root }
  )

  const total = String(SHOWCASE.length).padStart(2, '0')

  return (
    <section ref={root} className="work" id="work" aria-labelledby="work-title">
      <div className="work__pin">
        {/* Moves with the track on desktop (it reads as the first slide); stacks above it on smaller screens. */}
        <div className="work__intro container">
          <h2 className="section-title work__title" id="work-title">
            Work in <em>focus.</em>
          </h2>
          <p className="section-subtitle">
            Studio pieces across web, brand, AI and growth, showing the craft we bring to every engagement. Client case
            studies are shared on request.
          </p>
        </div>

        <div className="work__viewport">
          <ol className="work__track" aria-label="Portfolio">
            <li className="work__spacer" aria-hidden="true" />
            {SHOWCASE.map((item) => (
              <li
                key={item.id}
                className="pf-card"
                data-pan={item.image.width / item.image.height > CARD_ASPECT ? 'x' : 'y'}
                data-cursor="view"
              >
                <article aria-labelledby={`pf-${item.id}`}>
                  <div className="pf-card__frame">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      width={item.image.width}
                      height={item.image.height}
                      sizes="(max-width: 1024px) 88vw, 46vw"
                      className="pf-card__img"
                    />
                    <span className="pf-card__index">{item.id}</span>
                  </div>
                  <div className="pf-card__info">
                    <div className="pf-card__head">
                      <h3 className="pf-card__title" id={`pf-${item.id}`}>
                        {item.title}
                      </h3>
                      <p className="pf-card__discipline">{item.discipline}</p>
                    </div>
                    <p className="pf-card__desc">{item.description}</p>
                    <p className="pf-card__services">{item.services.join(' · ')}</p>
                  </div>
                </article>
              </li>
            ))}
            <li className="work__outro">
              <p>Want to see work relevant to your industry?</p>
              <a href="#contact" className="link-arrow" data-cursor="start">
                Request the full portfolio <span aria-hidden="true">→</span>
              </a>
            </li>
          </ol>
        </div>

        <div className="container work__rail" aria-hidden="true">
          <span className="work__count">
            <span className="work__count-current">01</span> / {total}
          </span>
          <span className="work__rail-line">
            <span className="work__rail-fill" />
          </span>
        </div>
      </div>
    </section>
  )
}
