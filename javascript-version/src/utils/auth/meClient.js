// Lightweight client-side cache for GET /api/auth/me
// - Dedupes concurrent calls by sharing a single in-flight Promise
// - Caches the successful response for a short TTL
// - Provides manual invalidation for logout or profile updates

let inFlight = null
let cache = null // { ts: number, data: any }

const getNow = () => Date.now()

const getStoredToken = () => {
  try {
    if (typeof window === 'undefined') return null
    return (
      window.localStorage.getItem('access_token') ||
      window.sessionStorage.getItem('access_token')
    )
  } catch {
    return null
  }
}

export const invalidateMeCache = () => {
  cache = null
}

export const seedMeCache = data => {
  cache = { ts: getNow(), data }
}

export async function fetchMeCached(options = {}) {
  const { force = false, timeoutMs } = options
  const token = getStoredToken()
  if (!token) return null

  const ttl = (() => {
    const v = Number(process.env.NEXT_PUBLIC_ME_TTL_MS)
    return Number.isFinite(v) && v > 0 ? v : 60_000
  })()

  // Serve from cache if fresh and not forced
  if (!force && cache && getNow() - cache.ts < ttl) {
    return cache.data
  }

  // Share in-flight request if present
  if (inFlight) return inFlight

  const apiBase = process.env.NEXT_PUBLIC_BASE_PATH || ''

  const controller = new AbortController()
  let timeoutId
  const ms = Number.isFinite(timeoutMs) ? timeoutMs : undefined
  if (ms && ms > 0) timeoutId = setTimeout(() => controller.abort(), ms)

  inFlight = fetch(`${apiBase}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
    signal: controller.signal
  })
    .then(async res => {
      if (res.ok) {
        const data = await res.json()
        cache = { ts: getNow(), data }
        return data
      }
      const err = new Error(`HTTP ${res.status}`)
      err.status = res.status
      throw err
    })
    .finally(() => {
      if (timeoutId) clearTimeout(timeoutId)
      inFlight = null
    })

  return inFlight
}

const meClient = {
  fetchMeCached,
  invalidateMeCache,
  seedMeCache
}

export default meClient
