// monitoring/instrumentation.js
import * as Sentry from '@sentry/react';
import LogRocket from 'logrocket';
import { PerformanceObserver } from 'perf_hooks';

// Initialize monitoring
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 0.2,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

LogRocket.init(process.env.LOGROCKET_APP_ID);

// Custom performance monitoring
const perfObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    // Send to analytics
    trackPerformance(entry.name, entry.duration);
  });
});

perfObserver.observe({ entryTypes: ['measure', 'resource'] });

// Real-time dashboard metrics
export const realTimeMetrics = {
  usersOnline: 0,
  activeListings: 0,
  inquiriesPerMinute: 0,
  systemHealth: 'healthy',
  
  updateMetrics() {
    // Connect to WebSocket for real-time updates
    const ws = new WebSocket('wss://metrics.example.com');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      Object.assign(this, data);
    };
  }
};