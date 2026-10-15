import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/layout/CustomCursor'
import SmoothScroll from '@/components/layout/SmoothScroll'

/**
 * The page frame shared by the home page and every inner page: skip link, cursor,
 * smooth scroll, navigation and footer. `backdrop` is for layers that sit behind the
 * content (the home page's travelling 3D mark); `mainClassName` styles the <main>.
 */
export default function SiteShell({
  children,
  backdrop,
  mainClassName,
}: {
  children: React.ReactNode
  backdrop?: React.ReactNode
  mainClassName?: string
}) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CustomCursor />
      {backdrop}
      <SmoothScroll>
        <Navigation />
        <main id="main" className={mainClassName}>
          {children}
        </main>
        <Footer />
      </SmoothScroll>
    </>
  )
}
