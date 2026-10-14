// Static hosts serve files by URL. Next's client requests prefetch payloads as flat
// names (`__next.<id>.services.__PAGE__.txt`) but this export writes them as nested
// folders (`__next.<id>/services/__PAGE__.txt`). Without this step every link prefetch
// 404s. Copy each nested payload to the flat name the client asks for.
import { readdirSync, copyFileSync, statSync } from 'node:fs'
import { join, relative, sep, dirname } from 'node:path'

const OUT = new URL('../out', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

function files(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    return statSync(p).isDirectory() ? files(p) : [p]
  })
}

let copied = 0
function walk(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n)
    if (!statSync(p).isDirectory()) continue
    if (n.startsWith('__next.')) {
      for (const f of files(p)) {
        const flat = `${n}.${relative(p, f).split(sep).join('.')}`
        copyFileSync(f, join(dirname(p), flat))
        copied++
      }
    } else {
      walk(p)
    }
  }
}
walk(OUT)
console.log(`flatten-prefetch: wrote ${copied} flat payload files`)
