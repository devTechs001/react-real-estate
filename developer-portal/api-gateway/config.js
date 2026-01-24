// API Gateway Configuration
const apiGateway = new APIGateway({
  rateLimits: {
    free: { requestsPerMinute: 60 },
    pro: { requestsPerMinute: 1000 },
    enterprise: { requestsPerMinute: 10000 }
  },
  
  authentication: {
    methods: ['api_key', 'oauth2', 'jwt'],
    scopes: ['read', 'write', 'admin']
  },
  
  endpoints: {
    properties: {
      path: '/v1/properties',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      webhooks: ['created', 'updated', 'deleted']
    },
    users: {
      path: '/v1/users',
      methods: ['GET', 'POST', 'PUT'],
      scopes: ['admin']
    }
  },
  
  analytics: {
    trackUsage: true,
    generateReports: true,
    alertThresholds: {
      highUsage: 80,
      errorRate: 5
    }
  }
});

export default apiGateway;