import { API_BASE_URL } from '@/lib/config/env'

/** Every API failure surfaces as this, so callers handle one error type. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number | null = null,
    /** True when the server replied with a message that is safe to show visitors. */
    readonly fromServer = false
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const TIMEOUT_MS = 15_000

// Endpoints reply `{ ok: true, ...data }` or `{ ok: false, error }` (see public/api/_lib.php).
type Envelope<T> = ({ ok: true } & T) | { ok: false; error?: string }

export async function apiPost<T extends object = object>(path: string, body: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === 'TimeoutError'
    throw new ApiError(timedOut ? 'The request timed out.' : 'Could not reach the server.')
  }

  const json = (await res.json().catch(() => null)) as Envelope<T> | null
  if (!res.ok || !json || !json.ok) {
    const serverMessage = json && !json.ok ? json.error : undefined
    throw new ApiError(serverMessage ?? 'Something went wrong.', res.status, Boolean(serverMessage))
  }
  return json
}
