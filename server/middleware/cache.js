import { getCache, setCache } from '../config/redis.js';

export const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await getCache(key);

      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      // Store original json function
      const originalJson = res.json.bind(res);

      // Override json function
      res.json = (body) => {
        res.json = originalJson;
        setCache(key, JSON.stringify(body), duration);
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

export const clearCache = (pattern) => {
  // Implementation depends on Redis
  console.log('Clearing cache for pattern:', pattern);
};