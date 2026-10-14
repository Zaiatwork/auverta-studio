import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import SmoothScroll from '@/components/SmoothScroll'

// Shared frame for every inner page. The home page composes its own (it owns the
// travelling mark), so it lives outside this route group.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CustomCursor />
      <SmoothScroll>
        <Navigation />
        <main id="main" className="inner">
          {children}
        </main>
        <Footer />
      </SmoothScroll>
    </>
  )
}
