// Single source of truth for site copy.
// Copy is drawn from the live auverta.studio site. No clients, results,
// statistics or testimonials are invented — add real ones here when available.

// NOTE: the live site links to "info@dev.auverta", which is not a valid address.
// Confirm the correct inbox before launch.
export const CONTACT_EMAIL = 'info@auverta.studio'

export const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/auverta.studio' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/auverta/' },
  { label: 'Facebook', href: 'https://www.facebook.com/share/1CKadD9TnT/' },
]

export const NAV_LINKS = [
  { label: 'Work', href: '/work/' },
  { label: 'Services', href: '/services/' },
  { label: 'About', href: '/about/' },
  { label: 'Process', href: '/process/' },
  { label: 'Contact', href: '/contact/' },
]

export const PILLARS = ['Strategy', 'Design', 'Technology', 'AI', 'Growth'] as const

export type Service = {
  number: string
  title: string
  description: string
  tags: string[]
  image?: { src: string; alt: string }
}

export const SERVICES: Service[] = [
  {
    number: '01',
    title: 'Digital Experiences',
    description:
      'Responsive, high-converting websites with seamless UI/UX, fast load speeds and built-in SEO, engineered to turn visitors into clients.',
    tags: ['Web Design', 'Web Development', 'UI/UX', 'Motion'],
    image: { src: '/images/web-development.webp', alt: 'Laptop displaying a lime-green website hero with chrome 3D forms' },
  },
  {
    number: '02',
    title: 'Brand & Creative',
    description:
      'Strategic logo design, complete visual ecosystems and premium brand positioning engineered to make your presence unmissable.',
    tags: ['Branding', 'Identity', 'Graphic Design', 'Art Direction'],
    image: { src: '/images/branding.webp', alt: 'Glossy black folder releasing beams of violet, pink and lime with sculpted 3D shapes' },
  },
  {
    number: '03',
    title: 'AI Creative',
    description:
      'A generative AI stack for photorealistic images, cinematic video sequences and scroll-stopping campaign media, produced at scale.',
    tags: ['AI Images', 'AI Video', 'Campaign Media', 'Product Visuals'],
    image: { src: '/images/ai-content.webp', alt: 'Collage of AI-generated product and portrait imagery' },
  },
  {
    number: '04',
    title: 'Marketing & Growth',
    description:
      'SEO, paid media and conversion-rate optimisation combined to turn digital channels into predictable revenue drivers.',
    tags: ['SEO', 'Paid Media', 'Performance', 'CRO'],
    image: { src: '/images/digital-marketing.webp', alt: 'Glass infinity loop half-filled with glowing lime liquid' },
  },
  {
    number: '05',
    title: 'Content & Media',
    description:
      'Your brand story brought to life with custom visual assets, cinematic video production and polished post-production.',
    tags: ['Video Editing', 'Graphic Design', 'Social Content', 'Post-Production'],
    image: { src: '/images/contact.webp', alt: 'The Auverta mark glowing lime inside a cracked violet stone' },
  },
]

export type Showcase = {
  id: string
  title: string
  discipline: string
  services: string[]
  description: string
  // Any image works. Wide images pan sideways on hover; tall full-page
  // screenshots (e.g. 1440 × 4000) scroll vertically, like a live preview.
  image: { src: string; alt: string; width: number; height: number }
}

// The portfolio shown in "Work in focus". The live site has no client case studies yet,
// so these are Auverta's own studio pieces (the visuals from auverta.studio), labelled
// as such. Replace them with real projects here: name, services, and a full-page
// screenshot as the image, and the hover preview will scroll through the page.
export const SHOWCASE: Showcase[] = [
  {
    id: '01',
    title: 'Web, engineered to convert',
    discipline: 'Web Design & Development',
    services: ['UI/UX', 'Development', 'SEO'],
    description:
      'High-converting websites featuring seamless UI/UX design, lightning-fast load speeds and built-in SEO, engineered to turn visitors into clients.',
    image: { src: '/images/web-development.webp', alt: 'Laptop displaying a lime-green website hero with chrome 3D forms', width: 1344, height: 700 },
  },
  {
    id: '02',
    title: 'Identity with gravity',
    discipline: 'Branding',
    services: ['Logo', 'Visual System', 'Positioning'],
    description:
      'Strategic logo design, complete visual ecosystems and premium brand positioning engineered to make your digital presence unmissable.',
    image: { src: '/images/branding.webp', alt: 'Glossy black folder releasing beams of violet, pink and lime with sculpted 3D shapes', width: 1344, height: 700 },
  },
  {
    id: '03',
    title: 'Generative, art-directed',
    discipline: 'AI Content Creation',
    services: ['AI Images', 'AI Video', 'Campaign Media'],
    description:
      'Our generative AI stack produces stunning, photorealistic images and engaging, cinematic videos, directed with the same eye as any shoot.',
    image: { src: '/images/ai-content.webp', alt: 'Collage of AI-generated product and portrait imagery', width: 1344, height: 700 },
  },
  {
    id: '04',
    title: 'Growth on a loop',
    discipline: 'Digital Marketing',
    services: ['Paid Media', 'SEO', 'CRO'],
    description:
      'High-ROI performance marketing, targeted paid media and data-driven campaigns engineered to generate qualified leads and maximise revenue.',
    image: { src: '/images/digital-marketing.webp', alt: 'Glass infinity loop half-filled with glowing lime liquid', width: 1344, height: 700 },
  },
  {
    id: '05',
    title: 'The mark, unearthed',
    discipline: 'Content & Media',
    services: ['3D', 'Art Direction', 'Post-Production'],
    description:
      'Custom visual assets and polished post-production that bring a brand story to life, from a single hero image to a full campaign.',
    image: { src: '/images/contact.webp', alt: 'The Auverta mark glowing lime inside a cracked violet stone', width: 1060, height: 986 },
  },
]

export const PROCESS = [
  {
    number: '01',
    phase: 'Discover',
    title: 'Onboarding & Audit',
    description:
      'A deep-dive consultation to understand your business goals, target audience and project scope. We distil it into a customised growth brief.',
    deliverables: ['Discovery Call', 'Audit', 'Growth Brief', 'Project Scope'],
  },
  {
    number: '02',
    phase: 'Strategize',
    title: 'Strategy & Blueprint',
    description:
      'We construct your creative roadmap: UI/UX wireframes, visual direction, AI workflows and target campaign architecture.',
    deliverables: ['UX Wireframes', 'Visual Direction', 'AI Workflows', 'Campaign Architecture'],
  },
  {
    number: '03',
    phase: 'Create',
    title: 'Design & Production',
    description:
      'High-impact visuals, brand systems, ad creatives and AI content. Every surface is designed with intent.',
    deliverables: ['Brand Design', 'Web UI', 'Ad Creatives', 'AI Content'],
  },
  {
    number: '04',
    phase: 'Build',
    title: 'Development & Launch',
    description:
      'Responsive, performance-first platforms built and deployed for a seamless launch, SEO-ready from day one.',
    deliverables: ['Development', 'CMS', 'SEO Setup', 'Launch'],
  },
  {
    number: '05',
    phase: 'Grow',
    title: 'Delivery & Scaling',
    description:
      'After handoff we analyse real-time performance, refine campaigns and optimise your assets to drive continuous growth and higher ROI.',
    deliverables: ['Analytics', 'Optimisation', 'Ongoing SEO', 'Scaling'],
  },
]

export const DISCIPLINES = ['Strategy', 'Design', 'Development', 'AI', 'Content', 'Marketing', 'Growth'] as const

export const VALUES = [
  {
    number: '01',
    title: 'Strategy first',
    description: 'Every project starts with a strategic brief. Creative decisions are backed by research and positioning, not guesswork.',
  },
  {
    number: '02',
    title: 'Design with intent',
    description: 'Considered creative direction across every pixel, typographic choice and brand asset.',
  },
  {
    number: '03',
    title: 'Technical depth',
    description: 'Modern frameworks and performance-first engineering. Fast, scalable and built to last.',
  },
  {
    number: '04',
    title: 'AI where it adds value',
    description: 'Generative tools accelerate production and open new creative territory. Always art-directed, never generic.',
  },
  {
    number: '05',
    title: 'Built to grow',
    description: 'Design and development that converts. Decisions are measured against traffic, leads and revenue.',
  },
  {
    number: '06',
    title: 'One accountable team',
    description: 'One team, one vision. No fragmented vendors or hand-offs between agencies.',
  },
]
