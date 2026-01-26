import * as tf from '@tensorflow/tfjs-node';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import UAParser from 'ua-parser-js';
import geoip from 'geoip-lite';

class SystemProtectionService {
  constructor() {
    this.threatModel = null;
    this.anomalyDetector = null;
    this.blacklist = new Set();
    this.whitelist = new Set();
    this.suspiciousActivities = new Map();
    this.rateLimiters = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      this.threatModel = await this.loadThreatModel();
      this.anomalyDetector = this.createAnomalyDetector();
      await this.loadSecurityLists();
      this.initialized = true;
      console.log('System protection service initialized');
    } catch (error) {
      console.error('Failed to initialize system protection:', error);
    }
  }

  async loadThreatModel() {
    // Create or load threat detection model
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [15], units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  createAnomalyDetector() {
    return {
      detectAnomaly: (data) => {
        // Simplified anomaly detection
        const threshold = 0.7;
        const score = this.calculateAnomalyScore(data);
        return score > threshold;
      }
    };
  }

  async protectRequest(req, res, next) {
    try {
      const threat = await this.assessThreat(req);
      
      if (threat.level === 'critical') {
        await this.blockRequest(req, threat);
        return res.status(403).json({
          error: 'Access denied',
          reason: threat.reason
        });
      }

      if (threat.level === 'high') {
        await this.logSuspiciousActivity(req, threat);
        req.threatLevel = threat;
      }

      // Add security headers
      this.addSecurityHeaders(res);

      // Rate limiting
      const rateLimited = await this.checkRateLimit(req);
      if (rateLimited) {
        return res.status(429).json({
          error: 'Too many requests',
          retryAfter: rateLimited.retryAfter
        });
      }

      next();
    } catch (error) {
      console.error('Protection middleware error:', error);
      next();
    }
  }

  async assessThreat(req) {
    const threats = [];
    let threatLevel = 'low';

    // Check IP reputation
    const ipThreat = await this.checkIPReputation(req.ip);
    if (ipThreat.malicious) {
      threats.push('Malicious IP detected');
      threatLevel = 'critical';
    }

    // Check for SQL injection attempts
    if (this.detectSQLInjection(req)) {
      threats.push('SQL injection attempt');
      threatLevel = 'critical';
    }

    // Check for XSS attempts
    if (this.detectXSS(req)) {
      threats.push('XSS attempt detected');
      threatLevel = 'critical';
    }

    // Check for path traversal
    if (this.detectPathTraversal(req)) {
      threats.push('Path traversal attempt');
      threatLevel = 'high';
    }

    // Check user behavior
    const behaviorThreat = await this.analyzeBehavior(req);
    if (behaviorThreat.suspicious) {
      threats.push(behaviorThreat.reason);
      threatLevel = threatLevel === 'critical' ? 'critical' : 'high';
    }

    // Check for bot activity
    const botDetection = this.detectBot(req);
    if (botDetection.isBot && !botDetection.isGoodBot) {
      threats.push('Malicious bot detected');
      threatLevel = 'high';
    }

    // ML-based threat detection
    const mlThreat = await this.detectThreatML(req);
    if (mlThreat.isThreat) {
      threats.push('ML model detected threat');
      threatLevel = mlThreat.severity;
    }

    return {
      level: threatLevel,
      threats,
      reason: threats.join(', '),
      timestamp: new Date(),
      requestId: crypto.randomBytes(16).toString('hex')
    };
  }

  async checkIPReputation(ip) {
    // Check blacklist
    if (this.blacklist.has(ip)) {
      return { malicious: true, reason: 'Blacklisted IP' };
    }

    // Check whitelist
    if (this.whitelist.has(ip)) {
      return { malicious: false, trusted: true };
    }

    // GeoIP check
    const geo = geoip.lookup(ip);
    const riskyCountries = ['XX', 'YY']; // Placeholder for high-risk countries
    
    if (geo && riskyCountries.includes(geo.country)) {
      return { malicious: false, suspicious: true, reason: 'High-risk country' };
    }

    // Check suspicious activity history
    const activities = this.suspiciousActivities.get(ip) || [];
    if (activities.length > 5) {
      return { malicious: true, reason: 'Multiple suspicious activities' };
    }

    return { malicious: false };
  }

  detectSQLInjection(req) {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)/gi,
      /(\'|\"|;|--|\bOR\b|\bAND\b)/gi,
      /(\bEXEC\b|\bEXECUTE\b|\bCAST\b|\bDECLARE\b)/gi,
      /(xp_cmdshell|sp_executesql)/gi
    ];

    const checkString = (str) => {
      if (!str) return false;
      return sqlPatterns.some(pattern => pattern.test(str));
    };

    // Check all request data
    const body = JSON.stringify(req.body || {});
    const query = JSON.stringify(req.query || {});
    const params = JSON.stringify(req.params || {});

    return checkString(body) || checkString(query) || checkString(params);
  }

  detectXSS(req) {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<img[^>]*onerror=/gi,
      /eval\(/gi,
      /alert\(/gi
    ];

    const checkString = (str) => {
      if (!str) return false;
      return xssPatterns.some(pattern => pattern.test(str));
    };

    const body = JSON.stringify(req.body || {});
    const query = JSON.stringify(req.query || {});

    return checkString(body) || checkString(query);
  }

  detectPathTraversal(req) {
    const traversalPatterns = [
      /\.\.\//g,
      /\.\.%2f/gi,
      /%2e%2e\//gi,
      /\.\.\\/g
    ];

    const url = req.url || '';
    const path = req.path || '';

    return traversalPatterns.some(pattern => 
      pattern.test(url) || pattern.test(path)
    );
  }

  async analyzeBehavior(req) {
    const userId = req.user?.id;
    if (!userId) return { suspicious: false };

    const key = `behavior:${userId}`;
    const recentActions = await this.getRecentActions(key);
    
    // Check for suspicious patterns
    if (recentActions.length > 100) {
      return { 
        suspicious: true, 
        reason: 'Excessive activity detected' 
      };
    }

    // Check for automated behavior
    const timestamps = recentActions.map(a => a.timestamp);
    if (this.detectAutomatedPattern(timestamps)) {
      return { 
        suspicious: true, 
        reason: 'Automated behavior pattern detected' 
      };
    }

    return { suspicious: false };
  }

  detectBot(req) {
    const ua = new UAParser(req.headers['user-agent']);
    const browser = ua.getBrowser();
    const os = ua.getOS();

    // Known good bots
    const goodBots = ['Googlebot', 'Bingbot', 'Slackbot'];
    const isGoodBot = goodBots.some(bot => 
      req.headers['user-agent']?.includes(bot)
    );

    // Bot detection criteria
    const criteria = {
      noUserAgent: !req.headers['user-agent'],
      suspiciousUserAgent: /bot|crawler|spider|scraper/i.test(req.headers['user-agent']),
      noReferer: !req.headers['referer'] && req.method === 'POST',
      noCookies: !req.headers['cookie'],
      highRequestRate: false // Would be checked against rate limit data
    };

    const botScore = Object.values(criteria).filter(Boolean).length;
    
    return {
      isBot: botScore >= 2,
      isGoodBot,
      score: botScore,
      criteria
    };
  }

  async detectThreatML(req) {
    if (!this.threatModel) return { isThreat: false };

    try {
      const features = this.extractSecurityFeatures(req);
      const input = tf.tensor2d([features]);
      const prediction = await this.threatModel.predict(input).data();
      
      input.dispose();

      const threatProbability = prediction[0];
      
      return {
        isThreat: threatProbability > 0.7,
        probability: threatProbability,
        severity: threatProbability > 0.9 ? 'critical' : 
                 threatProbability > 0.7 ? 'high' : 'medium'
      };
    } catch (error) {
      console.error('ML threat detection error:', error);
      return { isThreat: false };
    }
  }

  extractSecurityFeatures(req) {
    return [
      req.body ? Object.keys(req.body).length : 0,
      req.query ? Object.keys(req.query).length : 0,
      req.headers['user-agent'] ? 1 : 0,
      req.headers['referer'] ? 1 : 0,
      req.headers['cookie'] ? 1 : 0,
      this.detectSQLInjection(req) ? 1 : 0,
      this.detectXSS(req) ? 1 : 0,
      this.detectPathTraversal(req) ? 1 : 0,
      req.method === 'POST' ? 1 : 0,
      req.method === 'DELETE' ? 1 : 0,
      req.url?.length || 0,
      JSON.stringify(req.body || {}).length,
      req.ip ? 1 : 0,
      Date.now() % 86400000, // Time of day
      Math.random() // Placeholder for additional features
    ];
  }

  async blockRequest(req, threat) {
    // Add IP to temporary blacklist
    const ip = req.ip;
    this.blacklist.add(ip);
    
    // Log the threat
    await this.logThreat(req, threat);
    
    // Schedule removal from blacklist (temporary ban)
    setTimeout(() => {
      this.blacklist.delete(ip);
    }, 3600000); // 1 hour ban
  }

  async logSuspiciousActivity(req, threat) {
    const ip = req.ip;
    const activities = this.suspiciousActivities.get(ip) || [];
    
    activities.push({
      timestamp: Date.now(),
      threat,
      url: req.url,
      method: req.method
    });
    
    // Keep only recent activities
    const recentActivities = activities.filter(a => 
      Date.now() - a.timestamp < 3600000 // Last hour
    );
    
    this.suspiciousActivities.set(ip, recentActivities);
  }

  addSecurityHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  }

  async checkRateLimit(req) {
    const key = req.user?.id || req.ip;
    const limit = req.user ? 100 : 50; // Different limits for authenticated users
    const window = 60000; // 1 minute window

    const current = this.rateLimiters.get(key) || { count: 0, resetTime: Date.now() + window };
    
    if (Date.now() > current.resetTime) {
      current.count = 1;
      current.resetTime = Date.now() + window;
    } else {
      current.count++;
    }
    
    this.rateLimiters.set(key, current);
    
    if (current.count > limit) {
      return {
        limited: true,
        retryAfter: Math.ceil((current.resetTime - Date.now()) / 1000)
      };
    }
    
    return false;
  }

  async validateToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Additional checks
      if (decoded.exp < Date.now() / 1000) {
        return { valid: false, reason: 'Token expired' };
      }
      
      // Check if token is in blacklist
      const isBlacklisted = await this.checkTokenBlacklist(token);
      if (isBlacklisted) {
        return { valid: false, reason: 'Token blacklisted' };
      }
      
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, reason: error.message };
    }
  }

  async sanitizeInput(data) {
    if (typeof data === 'string') {
      // Remove HTML tags
      data = data.replace(/<[^>]*>/g, '');
      // Remove SQL keywords
      data = data.replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b/gi, '');
      // Remove script tags
      data = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      // Escape special characters
      data = data.replace(/[<>\"\']/g, (char) => {
        const escapeMap = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        };
        return escapeMap[char];
      });
    } else if (typeof data === 'object' && data !== null) {
      for (const key in data) {
        data[key] = await this.sanitizeInput(data[key]);
      }
    }
    
    return data;
  }

  // Helper methods
  calculateAnomalyScore(data) {
    // Simplified anomaly score calculation
    let score = 0;
    
    // Check various anomaly indicators
    if (data.requestRate > 100) score += 0.3;
    if (data.failedAttempts > 5) score += 0.4;
    if (data.unusualTime) score += 0.2;
    if (data.suspiciousPattern) score += 0.3;
    
    return Math.min(score, 1);
  }

  detectAutomatedPattern(timestamps) {
    if (timestamps.length < 5) return false;
    
    // Check for regular intervals
    const intervals = [];
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1]);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => 
      sum + Math.pow(interval - avgInterval, 2), 0
    ) / intervals.length;
    
    // Low variance indicates automated behavior
    return variance < 1000; // Threshold for automated pattern
  }

  async getRecentActions(key) {
    // Retrieve recent actions from cache/database
    // Simplified implementation
    return [];
  }

  async loadSecurityLists() {
    // Load blacklist and whitelist from database/file
    // Add known bad IPs
    this.blacklist.add('192.168.1.100'); // Example
    
    // Add trusted IPs
    this.whitelist.add('127.0.0.1');
    this.whitelist.add('::1');
  }

  async logThreat(req, threat) {
    // Log threat to database/monitoring system
    console.error('THREAT DETECTED:', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      threat,
      timestamp: new Date()
    });
  }

  async checkTokenBlacklist(token) {
    // Check if token is blacklisted
    return false; // Simplified
  }
}

export default new SystemProtectionService();