import SiteShell from '@/components/layout/SiteShell'
import Hero from '@/components/sections/Hero'
import Marquee from '@/components/sections/Marquee'
import Positioning from '@/components/sections/Positioning'
import Services from '@/components/sections/Services'
import Work from '@/components/sections/Work'
import WhyAuverta from '@/components/sections/WhyAuverta'
import Process from '@/components/sections/Process'
import FinalCTA from '@/components/sections/FinalCTA'
import Contact from '@/components/sections/Contact'
import IconJourney from '@/components/three/IconJourney'

// Server component: sections that need the browser opt in with 'use client'
// individually. Testimonials are intentionally omitted until real client
// quotes exist; the live site only has placeholder text.
export default function HomePage() {
  return (
    // The travelling Auverta mark: one fixed layer behind every section, hero to footer.
    <SiteShell backdrop={<IconJourney />}>
      <Hero />
      <Marquee />
      <Positioning />
      <Services />
      <Work />
      <WhyAuverta />
      <Process />
      <FinalCTA />
      <Contact />
    </SiteShell>
  )
}
