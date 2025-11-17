/**
 * Redis Client Configuration
 * Used for rate limiting anonymous users
 * Connects to Redis instance on SmartCamp.AI VPS
 */

import Redis from 'ioredis'

// Create Redis client
// Fallback to a mock client in development if Redis URL is not set
let redis: Redis | null = null

try {
  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      reconnectOnError(err) {
        const targetError = 'READONLY'
        if (err.message.includes(targetError)) {
          // Only reconnect when the error contains "READONLY"
          return true
        }
        return false
      },
    })

    redis.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })

    redis.on('connect', () => {
      console.log('Redis Client Connected')
    })
  } else {
    console.warn('REDIS_URL not set - rate limiting will use in-memory fallback')
  }
} catch (error) {
  console.error('Failed to create Redis client:', error)
}

export { redis }

/**
 * Check if Redis is available
 */
export function isRedisAvailable(): boolean {
  return redis !== null && redis.status === 'ready'
}

/**
 * Gracefully close Redis connection
 */
export async function closeRedis() {
  if (redis) {
    await redis.quit()
  }
}
