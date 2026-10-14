// Copy for inner pages. Like content.ts: no invented clients, results or statistics.
import { SERVICES, SHOWCASE, type Service, type Showcase } from './content'

export const SITE_URL = 'https://auverta.studio'

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export type ServiceDetail = {
  headline: string
  lead: string
  approach: { title: string; body: string }[]
  includes: string[]
  faqs: { q: string; a: string }[]
}

// Keyed by Service.number.
const DETAILS: Record<string, ServiceDetail> = {
  '01': {
    headline: 'Websites that earn their keep.',
    lead: 'We design and build fast, accessible sites where every section has a job: to explain, to persuade or to convert.',
    approach: [
      { title: 'Structure before style', body: 'We map pages to the questions your buyers ask, then design the layout that answers them in order.' },
      { title: 'Performance as a feature', body: 'Static builds, optimised media and lean code keep load times low and search engines happy.' },
      { title: 'Motion with purpose', body: 'Scroll and transition work guides attention. It never gets in the way of reading or tapping.' },
    ],
    includes: ['Information architecture', 'UI and UX design', 'Front-end development', 'Technical SEO setup', 'Forms and lead capture', 'Launch and handover'],
    faqs: [
      { q: 'What do you build sites with?', a: 'Modern frameworks such as Next.js, exported to fast static pages where it suits the project, with a lightweight backend for forms.' },
      { q: 'Will I be able to edit the content?', a: 'Yes. We scope editing needs in the brief and set up a workflow that fits your team.' },
      { q: 'Is SEO included?', a: 'Metadata, structured data, sitemaps and page speed are built in from the start.' },
    ],
  },
  '02': {
    headline: 'Identity with gravity.',
    lead: 'A brand that looks considered everywhere it appears, from a favicon to a keynote, and holds its shape as you grow.',
    approach: [
      { title: 'Position first', body: 'We settle who you are for, what you stand for and where you sit in the market before any logo is drawn.' },
      { title: 'A system, not a logo', body: 'Type, colour, layout and motion rules that let any team member produce on-brand work.' },
      { title: 'Tested in context', body: 'We show the identity on real surfaces, such as screens, decks and social, before we call it done.' },
    ],
    includes: ['Brand strategy and positioning', 'Logo and wordmark', 'Colour and type system', 'Brand guidelines', 'Templates and assets', 'Art direction'],
    faqs: [
      { q: 'Do you work with existing brands?', a: 'Yes. We can refresh, extend or systemise an identity you already have.' },
      { q: 'What files do we receive?', a: 'Master logo files, usage guidelines, colour and type specifications and ready-to-use templates.' },
      { q: 'How long does a brand project take?', a: 'It depends on scope. We give a clear timeline in the project scope after discovery.' },
    ],
  },
  '03': {
    headline: 'Generative, art-directed.',
    lead: 'Images and video produced with a generative stack and directed with the same eye as any shoot, so it looks intentional rather than generic.',
    approach: [
      { title: 'Direction before prompts', body: 'Mood, light, palette and framing are agreed up front so the output stays consistent across a campaign.' },
      { title: 'Human finishing', body: 'Every asset is reviewed, retouched and graded by a designer before it reaches you.' },
      { title: 'Built to scale', body: 'Repeatable workflows let us produce variants for formats and channels without starting over.' },
    ],
    includes: ['AI image generation', 'AI video sequences', 'Product visuals', 'Campaign media', 'Retouching and grading', 'Format variants'],
    faqs: [
      { q: 'Does it look obviously AI?', a: 'We art direct and finish every asset by hand so the result fits your brand rather than a stock look.' },
      { q: 'Can you match our brand?', a: 'Yes. We build a visual reference for your palette, lighting and subject matter first.' },
      { q: 'Who owns the assets?', a: 'Usage rights are confirmed in the project scope before work begins.' },
    ],
  },
  '04': {
    headline: 'Growth on a loop.',
    lead: 'Search, paid media and conversion work that connect traffic to leads and leads to revenue, measured against numbers you can check.',
    approach: [
      { title: 'Measure first', body: 'We set up analytics and goals so every channel can be judged on what it actually produces.' },
      { title: 'Fix the page, then buy traffic', body: 'Conversion work comes before spend, so budget is not wasted on pages that leak.' },
      { title: 'Review and refine', body: 'Regular reporting turns results into the next round of tests.' },
    ],
    includes: ['SEO strategy and content', 'Paid media management', 'Conversion optimisation', 'Analytics setup', 'Landing pages', 'Reporting'],
    faqs: [
      { q: 'Do you guarantee rankings?', a: 'No agency honestly can. We commit to the work, the process and clear reporting.' },
      { q: 'Which platforms do you run ads on?', a: 'We choose channels from your audience and goals, commonly search and social.' },
      { q: 'Can you work with our in-house team?', a: 'Yes. We can lead, support or train depending on what you need.' },
    ],
  },
  '05': {
    headline: 'Your story, produced properly.',
    lead: 'Custom visual assets, video and post-production that carry a brand story from a single hero image to a full campaign.',
    approach: [
      { title: 'One story, many formats', body: 'We plan content once and adapt it for web, social and presentations.' },
      { title: 'Craft in the edit', body: 'Pacing, sound, colour and type are finished with care, not left to templates.' },
      { title: 'Ready to publish', body: 'Deliverables arrive sized and named for the places they will be used.' },
    ],
    includes: ['Video editing', 'Motion graphics', 'Social content', 'Graphic design', '3D and art direction', 'Post-production'],
    faqs: [
      { q: 'Do you shoot footage?', a: 'We focus on editing, motion, 3D and generated media. We can brief and coordinate shoots when needed.' },
      { q: 'Can you handle ongoing content?', a: 'Yes. Monthly content packages can be scoped around your calendar.' },
      { q: 'What formats do you deliver?', a: 'Whatever your channels need, agreed in the project scope.' },
    ],
  },
}

export type ServicePage = Service & { slug: string; detail: ServiceDetail }

export const SERVICE_PAGES: ServicePage[] = SERVICES.map((s) => ({
  ...s,
  slug: slugify(s.title),
  detail: DETAILS[s.number],
}))

export type CasePage = Showcase & { slug: string }

export const CASE_PAGES: CasePage[] = SHOWCASE.map((c) => ({ ...c, slug: slugify(c.title) }))

export const ABOUT = {
  lead: 'Auverta is a creative technology and digital growth studio. We bring strategy, design, engineering and AI into one team so a project is never handed between vendors.',
  story: [
    'Most brands end up with a designer, a developer, a marketer and a content producer who rarely speak to each other. The work shows it.',
    'We built Auverta to close that gap. One team carries a project from the first conversation to launch and the growth that follows, so every decision is made with the whole picture in view.',
  ],
}

export const FAQ_GENERAL = [
  { q: 'How do we start?', a: 'Send a short brief through the contact form. We reply within one working day with a clear next step, usually a discovery call.' },
  { q: 'Who will we work with?', a: 'A small senior team that stays with the project from discovery through launch.' },
  { q: 'Do you take on one-off projects?', a: 'Yes, and ongoing retainers for teams that want continuous growth work.' },
]

export const LEGAL_UPDATED = '14 October 2026'
