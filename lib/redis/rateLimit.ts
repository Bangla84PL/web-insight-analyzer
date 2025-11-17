/**
 * Rate Limiting Utility
 * Implements IP-based rate limiting using Redis
 *
 * Limits:
 * - Anonymous users: 3 analyses/hour, 10 analyses/day
 * - Authenticated users: Unlimited (bypasses rate limiting)
 */

import { redis, isRedisAvailable } from './client'

// In-memory fallback for development/testing
const inMemoryStore = new Map<string, { count: number; expiry: number }>()

/**
 * Rate limit configuration
 */
const RATE_LIMITS = {
  HOURLY: {
    limit: 3,
    window: 3600, // 1 hour in seconds
  },
  DAILY: {
    limit: 10,
    window: 86400, // 24 hours in seconds
  },
}

/**
 * Check rate limit for an IP address
 * Returns { allowed: boolean, remaining: number, resetTime?: number }
 */
export async function checkRateLimit(
  ip: string,
  userId?: string
): Promise<{
  allowed: boolean
  remaining: number
  resetTime?: number
  message?: string
}> {
  // Authenticated users bypass rate limiting
  if (userId) {
    return {
      allowed: true,
      remaining: 999,
    }
  }

  // Check hourly limit first (more restrictive)
  const hourlyKey = `rate_limit:${ip}:hour`
  const hourlyResult = await incrementAndCheck(
    hourlyKey,
    RATE_LIMITS.HOURLY.limit,
    RATE_LIMITS.HOURLY.window
  )

  if (!hourlyResult.allowed) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: hourlyResult.resetTime,
      message: `Hourly limit exceeded. ${hourlyResult.remaining} analyses remaining. Try again in ${Math.ceil((hourlyResult.resetTime! - Date.now()) / 60000)} minutes.`,
    }
  }

  // Check daily limit
  const dailyKey = `rate_limit:${ip}:day`
  const dailyResult = await incrementAndCheck(
    dailyKey,
    RATE_LIMITS.DAILY.limit,
    RATE_LIMITS.DAILY.window
  )

  if (!dailyResult.allowed) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: dailyResult.resetTime,
      message: `Daily limit exceeded. Try again tomorrow or sign up for unlimited analyses.`,
    }
  }

  // Return the more restrictive remaining count
  const remaining = Math.min(hourlyResult.remaining, dailyResult.remaining)

  return {
    allowed: true,
    remaining,
  }
}

/**
 * Increment counter and check against limit
 */
async function incrementAndCheck(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{
  allowed: boolean
  remaining: number
  resetTime?: number
}> {
  if (isRedisAvailable() && redis) {
    try {
      // Use Redis pipeline for atomic operations
      const pipeline = redis.pipeline()
      pipeline.incr(key)
      pipeline.ttl(key)
      const results = await pipeline.exec()

      if (!results) {
        throw new Error('Redis pipeline failed')
      }

      const count = results[0][1] as number
      const ttl = results[1][1] as number

      // Set expiry on first increment
      if (ttl === -1) {
        await redis.expire(key, windowSeconds)
      }

      const remaining = Math.max(0, limit - count)
      const resetTime = ttl > 0 ? Date.now() + ttl * 1000 : Date.now() + windowSeconds * 1000

      return {
        allowed: count <= limit,
        remaining,
        resetTime,
      }
    } catch (error) {
      console.error('Redis rate limit error:', error)
      // Fall back to in-memory on Redis failure
      return incrementInMemory(key, limit, windowSeconds)
    }
  } else {
    // Use in-memory fallback
    return incrementInMemory(key, limit, windowSeconds)
  }
}

/**
 * In-memory rate limiting fallback
 */
function incrementInMemory(
  key: string,
  limit: number,
  windowSeconds: number
): {
  allowed: boolean
  remaining: number
  resetTime?: number
} {
  const now = Date.now()
  const entry = inMemoryStore.get(key)

  // Clean up expired entries
  if (entry && entry.expiry < now) {
    inMemoryStore.delete(key)
  }

  const current = entry && entry.expiry >= now ? entry.count : 0
  const newCount = current + 1
  const expiry = entry?.expiry || now + windowSeconds * 1000

  inMemoryStore.set(key, { count: newCount, expiry })

  const remaining = Math.max(0, limit - newCount)

  return {
    allowed: newCount <= limit,
    remaining,
    resetTime: expiry,
  }
}

/**
 * Get current rate limit status without incrementing
 */
export async function getRateLimitStatus(
  ip: string,
  userId?: string
): Promise<{
  hourly: { used: number; limit: number; remaining: number }
  daily: { used: number; limit: number; remaining: number }
}> {
  // Authenticated users bypass rate limiting
  if (userId) {
    return {
      hourly: { used: 0, limit: 999, remaining: 999 },
      daily: { used: 0, limit: 999, remaining: 999 },
    }
  }

  const hourlyKey = `rate_limit:${ip}:hour`
  const dailyKey = `rate_limit:${ip}:day`

  let hourlyUsed = 0
  let dailyUsed = 0

  if (isRedisAvailable() && redis) {
    try {
      hourlyUsed = (await redis.get(hourlyKey)) ? parseInt(await redis.get(hourlyKey)!) : 0
      dailyUsed = (await redis.get(dailyKey)) ? parseInt(await redis.get(dailyKey)!) : 0
    } catch (error) {
      console.error('Error getting rate limit status:', error)
    }
  } else {
    // Use in-memory store
    const now = Date.now()
    const hourlyEntry = inMemoryStore.get(hourlyKey)
    const dailyEntry = inMemoryStore.get(dailyKey)

    hourlyUsed = hourlyEntry && hourlyEntry.expiry >= now ? hourlyEntry.count : 0
    dailyUsed = dailyEntry && dailyEntry.expiry >= now ? dailyEntry.count : 0
  }

  return {
    hourly: {
      used: hourlyUsed,
      limit: RATE_LIMITS.HOURLY.limit,
      remaining: Math.max(0, RATE_LIMITS.HOURLY.limit - hourlyUsed),
    },
    daily: {
      used: dailyUsed,
      limit: RATE_LIMITS.DAILY.limit,
      remaining: Math.max(0, RATE_LIMITS.DAILY.limit - dailyUsed),
    },
  }
}

/**
 * Extract IP address from request headers
 * Handles proxies (Vercel, CloudFlare, etc.)
 */
export function getClientIp(request: Request): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  if (cfConnectingIp) return cfConnectingIp
  if (realIp) return realIp
  if (forwarded) return forwarded.split(',')[0].trim()

  // Fallback to a default (should not happen in production)
  return 'unknown'
}
