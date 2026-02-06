/**
 * Service API Cache Manager
 * Caches the services list which is frequently accessed
 */

type CacheData = {
  timestamp: number
  data: any
}

// In-memory cache
let serviceCache: CacheData | null = null
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Get cached services if still fresh, otherwise null
 */
export function getCachedServices() {
  if (!serviceCache) return null

  const now = Date.now()
  const isExpired = now - serviceCache.timestamp > CACHE_TTL_MS

  if (isExpired) {
    serviceCache = null
    return null
  }

  return serviceCache.data
}

/**
 * Set the services cache
 */
export function setCachedServices(data: any) {
  serviceCache = {
    timestamp: Date.now(),
    data: JSON.parse(JSON.stringify(data)) // Deep copy
  }
}

/**
 * Invalidate the services cache immediately
 * Call this after any service mutation (create, update, delete)
 */
export function invalidateServiceCache() {
  serviceCache = null
}

/**
 * Get cache status (for debugging)
 */
export function getCacheStatus() {
  if (!serviceCache) return { cached: false }

  const now = Date.now()
  const age = now - serviceCache.timestamp
  const isExpired = age > CACHE_TTL_MS

  return {
    cached: true,
    ageMs: age,
    ageSec: Math.round(age / 1000),
    expired: isExpired,
    ttlMs: CACHE_TTL_MS
  }
}
