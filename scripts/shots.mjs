// Design sweep: every section x 3 widths x 2 themes -> .shots/, plus overflow, tap-target and console checks.
// Run with the dev server up: npm run shots [url]
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const url = process.argv[2] ?? 'http://localhost:3000'
const widths = [[390, 844], [768, 1024], [1440, 900]]
const themes = ['light', 'dark']
const out = '.shots'
mkdirSync(out, { recursive: true })

const browser = await chromium.launch()
let issues = 0
for (const theme of themes) {
  for (const [w, h] of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 768 })
    await ctx.addInitScript((t) => localStorage.setItem('auverta-theme', t), theme)
    const page = await ctx.newPage()
    const errors = []
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    page.on('pageerror', (e) => errors.push(String(e)))
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2500) // hero intro

    const ids = await page.$$eval('main section[id], section[id]', (s) => s.map((e) => e.id))
    for (const id of ['top', ...ids.filter((i) => i !== 'top')]) {
      // instant jump: Lenis smooth scroll would otherwise leave us mid-flight
      await page.evaluate((i) => document.getElementById(i)?.scrollIntoView({ behavior: 'instant' }), id)
      await page.waitForTimeout(900)
      await page.screenshot({ path: `${out}/${theme}-${w}-${id}.png` })
    }

    const found = await page.evaluate(() => ({
      overflowX: document.documentElement.scrollWidth - innerWidth,
      small: [...document.querySelectorAll('a,button')]
        .filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height < 44 && matchMedia('(pointer: coarse)').matches })
        .map((e) => (e.textContent || e.ariaLabel || e.className).trim().slice(0, 24)),
    }))
    const bad = found.overflowX > 0 || found.small.length || errors.length
    if (bad) issues++
    console.log(`${theme} ${w}: overflowX=${found.overflowX} smallTargets=${found.small.length} consoleErrors=${errors.length}`)
    if (found.small.length) console.log('  small:', found.small.join(', '))
    for (const e of errors) console.log('  error:', e.slice(0, 160))
    await ctx.close()
  }
}
await browser.close()
console.log(issues ? `\n${issues} combo(s) with issues` : '\nclean')
process.exit(issues ? 1 : 0)
