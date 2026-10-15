'use client'

import { toggleTheme } from '@/lib/theme'

// Both icons are always rendered; CSS shows the one matching html[data-theme],
// so the server markup never disagrees with the theme set by the boot script.
export default function ThemeToggle({ className = '' }: { className?: string }) {
  return (
    <button type="button" className={`theme-toggle ${className}`} onClick={toggleTheme} aria-label="Switch between light and dark theme">
      <svg className="theme-toggle__moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
      <svg className="theme-toggle__sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  )
}
