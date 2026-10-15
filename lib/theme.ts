export type Theme = 'light' | 'dark'

export const THEME_KEY = 'auverta-theme'

/** Applies and persists a theme. Storage can be blocked (private mode); the choice then lasts for this page view. */
export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {}
}

export const toggleTheme = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')

// Inline script, run before first paint by app/layout.tsx:
// 1. Applies the saved theme (light by default) so there is no flash of the wrong theme.
// 2. Lets CSS hide above-the-fold elements that GSAP will reveal, without hiding them for
//    no-JS or reduced-motion visitors. If the hero never starts (e.g. a JS error), reveal after 3s.
export const BOOT_SCRIPT = `(function(){var d=document.documentElement;var t='light';try{t=localStorage.getItem('${THEME_KEY}')||'light'}catch(e){}d.dataset.theme=t;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('js');setTimeout(function(){if(!d.classList.contains('hero-in'))d.classList.add('reveal-fallback')},3000)})()`
