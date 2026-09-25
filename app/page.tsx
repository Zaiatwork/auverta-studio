import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Positioning from '@/components/Positioning'
import Services from '@/components/Services'
import Work from '@/components/Work'
import WhyAuverta from '@/components/WhyAuverta'
import Process from '@/components/Process'
import FinalCTA from '@/components/FinalCTA'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import SmoothScroll from '@/components/SmoothScroll'

// Server component: sections that need the browser opt in with 'use client'
// individually. Testimonials are intentionally omitted until real client
// quotes exist — the live site only has placeholder text.
export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CustomCursor />
      <SmoothScroll>
        <Navigation />
        <main id="main">
          <Hero />
          <Marquee />
          <Positioning />
          <Services />
          <Work />
          <WhyAuverta />
          <Process />
          <FinalCTA />
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  )
}
