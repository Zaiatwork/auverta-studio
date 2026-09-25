// The Auverta mark as SVG (paths from the brand favicon). Used wherever the 3D
// journey mark isn't running: reduced motion, no WebGL, or before it loads.
export const MARK_PATHS = [
  'M124.96,129.8c-5.94-7.22-17.65-3.02-17.65,6.33v235.11c0,11.18,15.59,13.88,19.35,3.35l28.15-78.88c2.2-6.15,9.62-8.56,15.01-4.87l143.25,98.17c9.52,6.52,20.66-5.64,13.32-14.55L124.96,129.8Z',
  'M403.85,140c-.04-11.18-15.64-13.82-19.36-3.28l-27.87,78.98c-2.17,6.16-9.59,8.6-15,4.92l-143.6-97.65c-9.54-6.49-20.63,5.72-13.27,14.6l202.31,243.93c5.97,7.19,17.66,2.95,17.63-6.4l-.84-235.11Z',
]

export default function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="107 127 297 262" aria-hidden="true" focusable="false">
      {MARK_PATHS.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
    </svg>
  )
}
