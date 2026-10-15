import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiPost } from './client'

const reply = (status: number, body: unknown) =>
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })))

afterEach(() => vi.unstubAllGlobals())

describe('apiPost', () => {
  it('returns the parsed body on { ok: true }', async () => {
    reply(200, { ok: true, id: 7 })
    await expect(apiPost('/api/x.php', {})).resolves.toEqual({ ok: true, id: 7 })
  })

  it('exposes server-authored messages', async () => {
    reply(422, { ok: false, error: 'Please check your details.' })
    await expect(apiPost('/api/x.php', {})).rejects.toMatchObject({ status: 422, fromServer: true, message: 'Please check your details.' })
  })

  it('treats a non-JSON reply as a generic failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html>502</html>', { status: 502 })))
    await expect(apiPost('/api/x.php', {})).rejects.toMatchObject({ status: 502, fromServer: false })
  })

  it('wraps network failures in ApiError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    await expect(apiPost('/api/x.php', {})).rejects.toBeInstanceOf(ApiError)
  })
})
