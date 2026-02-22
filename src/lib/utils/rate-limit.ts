/**
 * Simple in-memory rate limiter
 * In production, use Redis for distributed rate limiting
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const DEFAULT_LIMIT = 100
const DEFAULT_WINDOW = 60 * 1000 // 1 minute

export function rateLimit(
  key: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  // Clean up old entries (optional, for memory efficiency)
  if (Math.random() < 0.01) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k)
      }
    }
  }

  if (!entry || entry.resetTime < now) {
    // Create new window
    const resetTime = now + windowMs
    rateLimitStore.set(key, { count: 1, resetTime })
    return { success: true, remaining: limit - 1, resetTime }
  }

  // Check if limit exceeded
  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetTime: entry.resetTime }
  }

  // Increment count
  entry.count++
  return { success: true, remaining: limit - entry.count, resetTime: entry.resetTime }
}

/**
 * Create rate limit response headers
 */
export function getRateLimitHeaders(
  remaining: number,
  resetTime: number,
  limit: number = DEFAULT_LIMIT
): Record<string, string> {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
  }
}
