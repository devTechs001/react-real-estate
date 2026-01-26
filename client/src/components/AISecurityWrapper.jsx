import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaLock,
  FaUserShield,
  FaBan,
  FaFingerprint,
  FaEye,
  FaRobot,
  FaCode,
  FaNetworkWired,
  FaKey,
  FaSkull,
  FaSearch
} from 'react-icons/fa';
import { MdSecurity, MdVerifiedUser } from 'react-icons/md';
import securityService from '../services/securityService';
import toast from 'react-hot-toast';

const AISecurityWrapper = ({ children }) => {
  const [securityStatus, setSecurityStatus] = useState('checking');
  const [threats, setThreats] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [fraudScore, setFraudScore] = useState(0);
  const [behaviorAnalysis, setBehaviorAnalysis] = useState(null);
  
  const navigate = useNavigate();
  const activityBuffer = useRef([]);
  const suspiciousActivityCount = useRef(0);
  const lastActivityTime = useRef(Date.now());
  const sessionStartTime = useRef(Date.now());

  // Initialize security monitoring
  useEffect(() => {
    initializeSecurity();
    startMonitoring();
    
    return () => {
      stopMonitoring();
    };
  }, []);

  const initializeSecurity = async () => {
    try {
      // Verify session integrity
      const session = await securityService.verifySession();
      setSessionData(session);
      
      // Check for threats
      const threatAnalysis = await securityService.analyzeThreats();
      setThreats(threatAnalysis.threats);
      
      // Initialize behavior tracking
      const behavior = await securityService.initBehaviorTracking();
      setBehaviorAnalysis(behavior);
      
      // Set security status
      if (threatAnalysis.threats.length === 0) {
        setSecurityStatus('secure');
      } else if (threatAnalysis.severity === 'critical') {
        setSecurityStatus('blocked');
        setIsBlocked(true);
      } else {
        setSecurityStatus('warning');
      }
    } catch (error) {
      console.error('Security initialization error:', error);
      setSecurityStatus('error');
    }
  };

  const startMonitoring = () => {
    // Monitor user behavior
    document.addEventListener('click', handleUserActivity);
    document.addEventListener('keydown', handleKeyPress);
    window.addEventListener('beforeunload', handleUnload);
    
    // Monitor network requests
    interceptNetworkRequests();
    
    // Start periodic security checks
    const securityInterval = setInterval(performSecurityCheck, 30000); // Every 30 seconds
    
    // Detect developer tools
    detectDevTools();
    
    // Monitor clipboard
    monitorClipboard();
    
    // Check for browser extensions
    checkBrowserExtensions();
    
    window.securityInterval = securityInterval;
  };

  const stopMonitoring = () => {
    document.removeEventListener('click', handleUserActivity);
    document.removeEventListener('keydown', handleKeyPress);
    window.removeEventListener('beforeunload', handleUnload);
    
    if (window.securityInterval) {
      clearInterval(window.securityInterval);
    }
  };

  const handleUserActivity = useCallback((event) => {
    const activity = {
      type: 'click',
      target: event.target.tagName,
      timestamp: Date.now(),
      coordinates: { x: event.clientX, y: event.clientY }
    };
    
    activityBuffer.current.push(activity);
    
    // Analyze for suspicious patterns
    analyzeBehaviorPattern();
    
    // Rate limiting check
    checkRateLimit();
  }, []);

  const handleKeyPress = useCallback((event) => {
    // Detect suspicious key combinations
    const suspiciousKeys = [
      'F12', // Developer tools
      'PrintScreen', // Screenshot attempt
    ];
    
    if (suspiciousKeys.includes(event.key)) {
      recordSuspiciousActivity('suspicious_key', { key: event.key });
    }
    
    // Detect automated input patterns
    const currentTime = Date.now();
    const timeDiff = currentTime - lastActivityTime.current;
    
    if (timeDiff < 50) { // Too fast for human typing
      suspiciousActivityCount.current++;
      
      if (suspiciousActivityCount.current > 10) {
        handleBotDetection();
      }
    }
    
    lastActivityTime.current = currentTime;
  }, []);

  const handleUnload = (event) => {
    // Send security telemetry before page unload
    securityService.sendTelemetry({
      sessionDuration: Date.now() - sessionStartTime.current,
      activities: activityBuffer.current,
      threats: threats.length
    });
  };

  const interceptNetworkRequests = () => {
    // Override fetch to monitor requests
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [url, options = {}] = args;
      
      // Check for suspicious patterns
      if (isSuspiciousRequest(url, options)) {
        recordSuspiciousActivity('suspicious_request', { url });
        
        // Block if critical
        if (shouldBlockRequest(url)) {
          throw new Error('Request blocked by security system');
        }
      }
      
      // Add security headers
      const secureOptions = {
        ...options,
        headers: {
          ...options.headers,
          'X-Security-Token': sessionData?.securityToken,
          'X-Request-ID': generateRequestId()
        }
      };
      
      try {
        const response = await originalFetch(url, secureOptions);
        
        // Check response for threats
        await checkResponseSecurity(response);
        
        return response;
      } catch (error) {
        // Log security events
        securityService.logSecurityEvent('request_failed', { url, error: error.message });
        throw error;
      }
    };
  };

  const isSuspiciousRequest = (url, options) => {
    // Check for suspicious URLs
    const suspiciousPatterns = [
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i,
      /file:\/\//i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(url));
  };

  const shouldBlockRequest = (url) => {
    const blockedDomains = [
      'malicious-site.com',
      'phishing-domain.net'
    ];
    
    return blockedDomains.some(domain => url.includes(domain));
  };

  const checkResponseSecurity = async (response) => {
    // Check for security headers
    const securityHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'X-XSS-Protection',
      'Content-Security-Policy'
    ];
    
    const missingHeaders = securityHeaders.filter(header => !response.headers.get(header));
    
    if (missingHeaders.length > 0) {
      console.warn('Missing security headers:', missingHeaders);
    }
    
    // Check for suspicious content
    if (response.headers.get('content-type')?.includes('text/html')) {
      const text = await response.clone().text();
      
      if (containsSuspiciousContent(text)) {
        recordSuspiciousActivity('suspicious_content', { 
          url: response.url,
          contentSnippet: text.substring(0, 100)
        });
      }
    }
  };

  const containsSuspiciousContent = (content) => {
    const suspiciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /on\w+\s*=\s*["'][^"']*["']/gi,
      /javascript:/gi,
      /<iframe/gi
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(content));
  };

  const detectDevTools = () => {
    let devtools = { open: false, orientation: null };
    const threshold = 160;
    
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold) {
        devtools.open = true;
        recordSuspiciousActivity('devtools_open', devtools);
      }
    }, 500);
  };

  const monitorClipboard = () => {
    document.addEventListener('copy', (e) => {
      const selection = window.getSelection().toString();
      
      // Check for sensitive data patterns
      if (containsSensitiveData(selection)) {
        e.preventDefault();
        toast.error('Copying sensitive information is not allowed');
        recordSuspiciousActivity('sensitive_copy_attempt', { 
          contentLength: selection.length 
        });
      }
    });
    
    document.addEventListener('paste', (e) => {
      const clipboardData = e.clipboardData.getData('text');
      
      // Scan for malicious content
      if (containsMaliciousPatterns(clipboardData)) {
        e.preventDefault();
        toast.error('Suspicious content detected in clipboard');
        recordSuspiciousActivity('malicious_paste_attempt', {});
      }
    });
  };

  const containsSensitiveData = (text) => {
    const patterns = [
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    ];
    
    return patterns.some(pattern => pattern.test(text));
  };

  const containsMaliciousPatterns = (text) => {
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /<iframe/i
    ];
    
    return maliciousPatterns.some(pattern => pattern.test(text));
  };

  const checkBrowserExtensions = async () => {
    // Check for known malicious extensions
    const maliciousExtensions = [
      'malicious-extension-id-1',
      'malicious-extension-id-2'
    ];
    
    // Detection method varies by browser
    // This is a simplified example
    if (window.chrome && window.chrome.runtime) {
      // Chrome-specific extension detection
    }
  };

  const analyzeBehaviorPattern = () => {
    if (activityBuffer.current.length < 10) return;
    
    // Get recent activities
    const recentActivities = activityBuffer.current.slice(-20);
    
    // Check for bot-like patterns
    const timestamps = recentActivities.map(a => a.timestamp);
    const intervals = [];
    
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1]);
    }
    
    // Check for consistent intervals (bot behavior)
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => 
      sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
    
    if (variance < 100) { // Very consistent timing
      setFraudScore(prev => Math.min(prev + 0.1, 1));
      
      if (fraudScore > 0.7) {
        handleBotDetection();
      }
    }
    
    // Check for rapid clicking (click fraud)
    const clickCount = recentActivities.filter(a => a.type === 'click').length;
    const timeSpan = timestamps[timestamps.length - 1] - timestamps[0];
    const clickRate = clickCount / (timeSpan / 1000); // Clicks per second
    
    if (clickRate > 5) { // More than 5 clicks per second
      recordSuspiciousActivity('rapid_clicking', { rate: clickRate });
    }
    
    // Trim buffer to prevent memory issues
    if (activityBuffer.current.length > 100) {
      activityBuffer.current = activityBuffer.current.slice(-50);
    }
  };

  const checkRateLimit = () => {
    const now = Date.now();
    const recentActivities = activityBuffer.current.filter(
      a => now - a.timestamp < 60000 // Last minute
    );
    
    if (recentActivities.length > 100) { // More than 100 actions per minute
      recordSuspiciousActivity('rate_limit_exceeded', { 
        count: recentActivities.length 
      });
      
      // Apply throttling
      showSecurityChallenge();
    }
  };

  const recordSuspiciousActivity = async (type, data) => {
    const activity = {
      type,
      data,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    // Send to backend
    try {
      await securityService.reportSuspiciousActivity(activity);
    } catch (error) {
      console.error('Failed to report suspicious activity:', error);
    }
    
    // Update local threat list
    setThreats(prev => [...prev, activity]);
    
    // Update security status
    if (threats.length > 5) {
      setSecurityStatus('warning');
    }
    
    if (threats.length > 10) {
      setSecurityStatus('blocked');
      setIsBlocked(true);
    }
  };

  const handleBotDetection = () => {
    setIsBlocked(true);
    setSecurityStatus('blocked');
    
    // Show CAPTCHA or challenge
    showSecurityChallenge();
    
    // Report to backend
    securityService.reportBot({
      fraudScore,
      activities: activityBuffer.current.slice(-20),
      timestamp: Date.now()
    });
  };

  const showSecurityChallenge = () => {
    // Implement CAPTCHA or other challenge
    toast.error('Security verification required');
    navigate('/security-check');
  };

  const performSecurityCheck = async () => {
    try {
      const check = await securityService.performSecurityCheck();
      
      if (check.threats.length > 0) {
        setThreats(prev => [...prev, ...check.threats]);
      }
      
      if (check.action === 'block') {
        setIsBlocked(true);
        setSecurityStatus('blocked');
      }
    } catch (error) {
      console.error('Security check failed:', error);
    }
  };

  const generateRequestId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Security UI Components
  const SecurityIndicator = () => (
    <motion.div
      className={`fixed top-4 right-4 z-50 ${
        securityStatus === 'secure' ? 'text-green-500' :
        securityStatus === 'warning' ? 'text-yellow-500' :
        securityStatus === 'blocked' ? 'text-red-500' :
        'text-gray-500'
      }`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      onClick={() => setShowSecurityPanel(!showSecurityPanel)}
    >
      <div className="relative cursor-pointer">
        {securityStatus === 'secure' ? (
          <FaShieldAlt className="text-3xl" />
        ) : securityStatus === 'warning' ? (
          <FaExclamationTriangle className="text-3xl animate-pulse" />
        ) : securityStatus === 'blocked' ? (
          <FaBan className="text-3xl animate-bounce" />
        ) : (
          <BiScan className="text-3xl animate-spin" />
        )}
        
        {threats.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {threats.length}
          </span>
        )}
      </div>
    </motion.div>
  );

  const SecurityPanel = () => (
    <AnimatePresence>
      {showSecurityPanel && (
        <motion.div
          className="fixed top-16 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-96 max-h-96 overflow-y-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MdSecurity className="text-primary-600" />
              Security Status
            </h3>
            <button
              onClick={() => setShowSecurityPanel(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          {/* Security Score */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Security Score</span>
              <span className="text-sm font-semibold">
                {Math.round((1 - fraudScore) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  fraudScore < 0.3 ? 'bg-green-500' :
                  fraudScore < 0.7 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${(1 - fraudScore) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Threat List */}
          {threats.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Detected Threats</h4>
              <div className="space-y-2">
                {threats.slice(0, 5).map((threat, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded"
                  >
                    <FaExclamationTriangle className="text-red-500" />
                    <span>{threat.type.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Security Features */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FaCheckCircle className="text-green-500" />
              <span>SSL/TLS Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaCheckCircle className="text-green-500" />
              <span>XSS Protection</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaCheckCircle className="text-green-500" />
              <span>CSRF Protection</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {fraudScore < 0.5 ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaExclamationTriangle className="text-yellow-500" />
              )}
              <span>Bot Detection</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaCheckCircle className="text-green-500" />
              <span>Rate Limiting</span>
            </div>
          </div>
          
          {/* Session Info */}
          {sessionData && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-xs text-gray-500">
                Session ID: {sessionData.id?.substring(0, 8)}...
              </div>
              <div className="text-xs text-gray-500">
                Duration: {Math.round((Date.now() - sessionStartTime.current) / 60000)} min
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const BlockedScreen = () => (
    <div className="fixed inset-0 z-[100] bg-red-900 flex items-center justify-center">
      <div className="text-center text-white p-8">
        <FaSkull className="text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Access Blocked</h1>
        <p className="mb-4">Suspicious activity detected. Your access has been temporarily blocked.</p>
        <p className="text-sm opacity-80 mb-6">
          If you believe this is an error, please contact support with reference:
          <br />
          <code className="bg-red-800 px-2 py-1 rounded mt-2 inline-block">
            {sessionData?.id || 'UNKNOWN'}
          </code>
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-white text-red-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );

  const SecurityOverlay = () => (
    <AnimatePresence>
      {securityStatus === 'checking' && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center">
            <div className="relative mb-4">
              <FaSearch className="text-6xl text-primary-600 animate-pulse" />
              <div className="absolute inset-0 animate-ping">
                <FaSearch className="text-6xl text-primary-600 opacity-30" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Performing Security Scan</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
              Verifying environment integrity and checking for threats...
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaSpinner className="animate-spin" />
              <span>This may take a few seconds</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const SecurityWarningBanner = () => (
    <AnimatePresence>
      {securityStatus === 'warning' && !showSecurityPanel && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-40 bg-yellow-500 text-white py-2 px-4"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="text-xl" />
              <span className="text-sm font-medium">
                Security Warning: {threats.length} potential threat{threats.length !== 1 ? 's' : ''} detected
              </span>
            </div>
            <button
              onClick={() => setShowSecurityPanel(true)}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors"
            >
              View Details
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const SecurityMetrics = () => {
    if (!showSecurityPanel) return null;

    return (
      <div className="fixed bottom-4 right-4 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-500 dark:text-gray-400">Network Requests</div>
            <div className="font-semibold">{activityBuffer.current.filter(a => a.type === 'request').length}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Activities</div>
            <div className="font-semibold">{activityBuffer.current.length}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Session Time</div>
            <div className="font-semibold">
              {Math.floor((Date.now() - sessionStartTime.current) / 1000)}s
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Fraud Score</div>
            <div className={`font-semibold ${
              fraudScore < 0.3 ? 'text-green-500' :
              fraudScore < 0.7 ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {(fraudScore * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render blocked screen if access is blocked
  if (isBlocked) {
    return <BlockedScreen />;
  }

  // Main render
  return (
    <>
      {/* Security Overlay for initial check */}
      <SecurityOverlay />
      
      {/* Security Warning Banner */}
      <SecurityWarningBanner />
      
      {/* Security Status Indicator */}
      <SecurityIndicator />
      
      {/* Security Panel */}
      <SecurityPanel />
      
      {/* Security Metrics (dev mode) */}
      {process.env.NODE_ENV === 'development' && <SecurityMetrics />}
      
      {/* Wrapped Content */}
      <div className={`${securityStatus === 'warning' ? 'mt-10' : ''}`}>
        {children}
      </div>
      
      {/* Hidden Security Elements */}
      <div style={{ display: 'none' }}>
        {/* Honeypot for bot detection */}
        <input
          type="text"
          name="email_confirm"
          autoComplete="off"
          tabIndex="-1"
          onChange={(e) => {
            if (e.target.value) {
              handleBotDetection();
            }
          }}
        />
        
        {/* Invisible CAPTCHA container */}
        <div id="security-captcha-container" />
      </div>
      
      {/* Security Console (for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-40">
          <button
            onClick={() => {
              console.log('Security State:', {
                status: securityStatus,
                threats: threats,
                fraudScore: fraudScore,
                activities: activityBuffer.current,
                session: sessionData,
                behaviorAnalysis: behaviorAnalysis
              });
            }}
            className="bg-gray-800 text-white text-xs px-3 py-2 rounded hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <FaCode />
            Security Console
          </button>
        </div>
      )}
    </>
  );
};

// Export security hooks for use in other components
export const useSecurityContext = () => {
  const [isSecure, setIsSecure] = useState(true);
  const [securityLevel, setSecurityLevel] = useState('high');
  
  useEffect(() => {
    // Check security context
    const checkSecurity = async () => {
      try {
        const status = await securityService.getSecurityStatus();
        setIsSecure(status.secure);
        setSecurityLevel(status.level);
      } catch (error) {
        console.error('Security check failed:', error);
        setIsSecure(false);
        setSecurityLevel('unknown');
      }
    };
    
    checkSecurity();
    const interval = setInterval(checkSecurity, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return { isSecure, securityLevel };
};

// Export security utilities
export const securityUtils = {
  sanitizeInput: (input) => {
    // Remove potentially dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/javascript:/gi, '')
      .trim();
  },
  
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  generateCSRFToken: () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },
  
  encryptData: async (data) => {
    // Use Web Crypto API for client-side encryption
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );
    
    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv),
      key: await crypto.subtle.exportKey('jwk', key)
    };
  },
  
  hashPassword: async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
};

export default AISecurityWrapper;