import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Auverta's own typefaces, as used on auverta.studio: GHIGA for display
// headlines, Grift for everything else. Self-hosted from app/fonts.
const display = localFont({
  src: './fonts/GHIGA.otf',
  weight: '400',
  style: 'normal',
  variable: '--font-ghiga',
  display: 'swap',
})

const body = localFont({
  src: [
    { path: './fonts/Grift-Light.ttf', weight: '300', style: 'normal' },
    { path: './fonts/Grift-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/Grift-Italic.ttf', weight: '400', style: 'italic' },
    { path: './fonts/Grift-Medium.ttf', weight: '500', style: 'normal' },
    { path: './fonts/Grift-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: './fonts/Grift-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-grift',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://auverta.studio'),
  title: 'Auverta | Beyond Ordinary',
  description:
    'Auverta is a creative technology and digital growth studio. Strategy × Design × Technology × AI × Growth, combined into digital experiences that go beyond ordinary.',
  keywords: [
    'creative studio',
    'web design',
    'web development',
    'UI/UX',
    'branding',
    'AI creative',
    'AI video',
    'digital marketing',
    'SEO',
    'Auverta',
  ],
  openGraph: {
    title: 'Auverta | Beyond Ordinary',
    description: 'Creative technology + digital growth studio. Strategy × Design × Technology × AI × Growth.',
    url: 'https://auverta.studio',
    siteName: 'Auverta',
    type: 'website',
    images: [{ url: '/images/contact.webp', width: 1060, height: 986, alt: 'The Auverta mark' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auverta | Beyond Ordinary',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f3ef' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
}

// Runs before first paint:
// 1. Applies the saved theme (light by default) so there is no flash of the wrong theme.
// 2. Lets CSS hide above-the-fold elements that GSAP will reveal, without hiding them for
//    no-JS or reduced-motion visitors. If the hero never starts (e.g. a JS error), reveal after 3s.
const bootScript = `(function(){var d=document.documentElement;var t='light';try{t=localStorage.getItem('auverta-theme')||'light'}catch(e){}d.dataset.theme=t;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('js');setTimeout(function(){if(!d.classList.contains('hero-in'))d.classList.add('reveal-fallback')},3000)})()`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning: the inline script below sets data-theme and classes on <html> before hydration.
    <html lang="en" data-theme="light" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
