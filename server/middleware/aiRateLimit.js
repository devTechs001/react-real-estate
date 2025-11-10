import rateLimit from 'express-rate-limit';

export const aiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.AI_REQUESTS_PER_HOUR || 100,
  message: 'Too many AI requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'AI rate limit exceeded. Please try again later.',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

export const chatRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: 'Too many chat requests',
});

export const imageAnalysisLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Too many image analysis requests',
});