const items = [
  'Strategy',
  'Design',
  'Development',
  'AI Creative',
  'Digital Marketing',
  'SEO',
  'Branding',
  'Content',
  'UI/UX',
  'Growth',
  'Video',
  'Beyond Ordinary',
]

// Pure CSS loop — no client JS needed. The list is rendered twice so the
// -50% translate loops seamlessly.
export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee__group">
            {items.map((item, i) => (
              <li key={item} className={`marquee__item${i % 3 === 1 ? ' marquee__item--display' : ''}`}>
                {item}
                <span className="marquee__dot" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
