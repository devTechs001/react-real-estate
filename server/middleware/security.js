import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Prevent NoSQL injection
export const noSqlInjection = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized ${key} in request`);
  },
});

// Prevent XSS attacks
export const xssProtection = xss();

// Request size limiter
export const requestSizeLimiter = (req, res, next) => {
  const maxSize = 10 * 1024 * 1024; // 10MB

  let size = 0;
  req.on('data', (chunk) => {
    size += chunk.length;
    if (size > maxSize) {
      res.status(413).json({ message: 'Request entity too large' });
    }
  });

  next();
};

// IP whitelist/blacklist
const blacklistedIPs = new Set();

export const ipFilter = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;

  if (blacklistedIPs.has(clientIP)) {
    return res.status(403).json({ message: 'Access forbidden' });
  }

  next();
};

export const addToBlacklist = (ip) => {
  blacklistedIPs.add(ip);
};

export const removeFromBlacklist = (ip) => {
  blacklistedIPs.delete(ip);
};