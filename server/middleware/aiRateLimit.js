import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

// Create Redis client with error handling
let redis;
try {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    retryStrategy: (times) => {
      if (times > 3) {
        console.warn('⚠️ Redis connection failed, rate limiting will use memory store');
        return null; // Stop retrying
      }
      return Math.min(times * 200, 2000);
    },
  });

  redis.on('error', (err) => {
    // Silently handle Redis errors - rate limiter will still work with memory store
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected for rate limiting');
  });
} catch (error) {
  console.warn('⚠️ Redis not available for rate limiting');
}

// Use memory store as fallback if Redis is not available
const getStore = (prefix) => {
  if (redis) {
    return new RedisStore({
      client: redis,
      prefix,
    });
  }
  return null; // Will use memory store
};

// Different rate limits for different AI endpoints
export const aiRateLimit = rateLimit({
  store: getStore('ai_rate_limit:'),
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many AI requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many AI requests. Please wait before trying again.',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

// Premium rate limits for paid users
export const premiumAiRateLimit = rateLimit({
  store: getStore('ai_premium_rate_limit:'),
  windowMs: 60 * 1000, // 1 minute
  max: 50, // 50 requests per minute for premium users
  skip: (req) => req.user?.subscription?.type === 'premium',
});

// Strict rate limit for expensive operations
export const strictAiRateLimit = rateLimit({
  store: getStore('ai_strict_rate_limit:'),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: 'This AI feature has reached its usage limit. Please try again later.',
});