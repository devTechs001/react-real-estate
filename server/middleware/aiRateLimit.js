import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

// Different rate limits for different AI endpoints
export const aiRateLimit = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'ai_rate_limit:',
  }),
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
  store: new RedisStore({
    client: redis,
    prefix: 'ai_premium_rate_limit:',
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 50, // 50 requests per minute for premium users
  skip: (req) => req.user?.subscription?.type === 'premium',
});

// Strict rate limit for expensive operations
export const strictAiRateLimit = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'ai_strict_rate_limit:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: 'This AI feature has reached its usage limit. Please try again later.',
});