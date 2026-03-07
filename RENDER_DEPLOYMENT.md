# Render Deployment Guide

Complete guide for deploying the Real Estate Application to Render.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Deploy](#quick-deploy)
- [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Connect your GitHub account to Render
3. **Database**: MongoDB Atlas cluster (free tier available)
4. **Redis**: Render Redis or Redis Cloud (free tier available)

---

## Quick Deploy

### Option 1: Using render.yaml (Recommended)

```bash
# Install Render CLI
npm install -g @render-cloud/cli

# Login to Render
render login

# Deploy using configuration file
render up render.yaml
```

### Option 2: Via Render Dashboard

1. Go to [render.com/dashboard](https://dashboard.render.com)
2. Click **New +** → **Blueprint**
3. Connect your GitHub repository
4. Select `render.yaml` configuration file
5. Click **Apply**

---

## Manual Setup

### Step 1: Create Frontend (Static Site)

1. Navigate to **Dashboard** → **New +** → **Static Site**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `real-estate-client`
   - **Branch**: `main`
   - **Build Command**: `cd client && pnpm install && pnpm run build`
   - **Publish Directory**: `client/dist`
   - **Node Version**: `18`

4. Add Environment Variables:
   ```
   VITE_API_URL=<backend-url-from-step-2>
   VITE_GOOGLE_MAPS_API_KEY=your_key
   VITE_STRIPE_PUBLIC_KEY=your_key
   ```

### Step 2: Create Backend (Web Service)

1. Navigate to **Dashboard** → **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `real-estate-server`
   - **Region**: Oregon (or closest to your users)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node 18`
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `pnpm start`
   - **Instance Type**: Standard or higher (for always-on)

4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_secure_secret_min_32_chars
   JWT_EXPIRE=30d
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   OPENAI_API_KEY=your_key
   REDIS_URL=redis://...
   STRIPE_SECRET_KEY=your_key
   STRIPE_WEBHOOK_SECRET=your_secret
   FRONTEND_URL=<frontend-url-from-step-1>
   CORS_ORIGIN=<frontend-url-from-step-1>
   ```

5. Add Persistent Disk (for file uploads):
   - **Name**: `uploads`
   - **Mount Path**: `/opt/render/project/server/uploads`
   - **Size**: 5 GB (minimum)

### Step 3: Create Redis (Cache Service)

1. Navigate to **Dashboard** → **New +** → **Redis**
2. Configure:
   - **Name**: `real-estate-redis`
   - **Region**: Same as backend
   - **Plan**: Starter (free tier)
   - **Max Memory Policy**: `allkeys-lru`

3. Copy the Redis URL from the dashboard

### Step 4: Connect Services

1. Update frontend `VITE_API_URL` with backend URL
2. Update backend `REDIS_URL` with Redis connection string
3. Update backend `FRONTEND_URL` and `CORS_ORIGIN` with frontend URL

---

## Environment Variables

### Required Variables

| Variable | Service | Description |
|----------|---------|-------------|
| `NODE_ENV` | Backend | `production` |
| `MONGODB_URI` | Backend | MongoDB connection string |
| `JWT_SECRET` | Backend | JWT signing secret (32+ chars) |
| `CLOUDINARY_NAME` | Backend | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Backend | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Backend | Cloudinary API secret |
| `OPENAI_API_KEY` | Backend | OpenAI API key for AI features |
| `REDIS_URL` | Backend | Redis connection string |
| `STRIPE_SECRET_KEY` | Backend | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Backend | Stripe webhook signing secret |
| `VITE_API_URL` | Frontend | Backend API URL |
| `VITE_GOOGLE_MAPS_API_KEY` | Frontend | Google Maps API key |
| `VITE_STRIPE_PUBLIC_KEY` | Frontend | Stripe publishable key |

### Optional Variables

| Variable | Service | Default | Description |
|----------|---------|---------|-------------|
| `API_RATE_LIMIT_WINDOW_MS` | Backend | `900000` | Rate limit window (15 min) |
| `API_RATE_LIMIT_MAX_REQUESTS` | Backend | `100` | Max requests per window |
| `AI_RATE_LIMIT_WINDOW_MS` | Backend | `60000` | AI rate limit window (1 min) |
| `AI_RATE_LIMIT_MAX_REQUESTS` | Backend | `10` | Max AI requests per window |

---

## API Endpoints

After deployment, your API will be available at:

```
https://real-estate-server.onrender.com/api/*
```

### Endpoint Summary

| Module | Endpoints | Base Path |
|--------|-----------|-----------|
| Authentication | 13 | `/api/auth` |
| Properties | 7 | `/api/properties` |
| Admin | 16 | `/api/admin` |
| AI | 17 | `/api/ai` |
| Messages | 5 | `/api/messages` |
| Inquiries | 5 | `/api/inquiries` |
| Appointments | 5 | `/api/appointments` |
| Favorites | 5 | `/api/favorites` |
| Notifications | 5 | `/api/notifications` |
| Saved Searches | 6 | `/api/saved-searches` |
| Payments | 5 | `/api/payments` |
| Analytics | 2 | `/api/analytics` |
| Users | 6 | `/api/users` |
| Reviews | 5 | `/api/reviews` |
| Referrals | 7 | `/api/referrals` |
| Upload | 3 | `/api/upload` |
| Dashboard | 2 | `/api/dashboard` |

**Total: 80+ endpoints across 17 route modules**

### Testing Endpoints

```bash
# Health check
curl https://real-estate-server.onrender.com/api/health

# Test authentication
curl -X POST https://real-estate-server.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test properties endpoint
curl https://real-estate-server.onrender.com/api/properties
```

---

## Troubleshooting

### Build Failures

**Issue**: `pnpm command not found`
```bash
# Solution: Render includes pnpm by default
# If issues occur, add to build command:
npm install -g pnpm@8.6.0 && pnpm install
```

**Issue**: `Node version mismatch`
```bash
# Solution: Ensure Node 18 is specified in render.yaml
runtime: node-18
```

### Runtime Errors

**Issue**: `MongoDB connection failed`
```bash
# Check:
# 1. MongoDB Atlas IP whitelist includes 0.0.0.0/0
# 2. Connection string is correct
# 3. Database user has proper permissions
```

**Issue**: `CORS errors`
```bash
# Solution: Set CORS_ORIGIN in backend environment
CORS_ORIGIN=https://real-estate-client.onrender.com
```

**Issue**: `File upload fails`
```bash
# Solution: Ensure persistent disk is configured
# Mount Path: /opt/render/project/server/uploads
```

### Performance Issues

**Issue**: Slow response times
```bash
# Solutions:
# 1. Upgrade to Standard plan (always-on)
# 2. Enable Redis caching
# 3. Add database indexes
# 4. Optimize API queries
```

**Issue**: Rate limiting too aggressive
```bash
# Adjust in environment variables:
API_RATE_LIMIT_MAX_REQUESTS=200
AI_RATE_LIMIT_MAX_REQUESTS=20
```

---

## Monitoring

### Render Dashboard

- **Logs**: View real-time logs in the dashboard
- **Metrics**: Monitor CPU, memory, and request counts
- **Alerts**: Set up email notifications for failures

### Health Checks

Configure health check endpoint:
```
Path: /api/health
Interval: 5 minutes
```

---

## Cost Estimation

### Free Tier

- **Frontend**: Free (static site)
- **Backend**: $7/month (Standard instance, always-on)
- **Redis**: Free (Starter, 25MB)
- **Database**: Free (MongoDB Atlas M0)

**Total: ~$7-10/month**

### Production Tier

- **Frontend**: Free (Pro plan for custom domain)
- **Backend**: $25/month (Standard+ instance)
- **Redis**: $7/month (Starter+)
- **Database**: $25/month (MongoDB Atlas M10)

**Total: ~$57-70/month**

---

## Security Checklist

- [ ] All environment variables set (no defaults)
- [ ] MongoDB IP whitelist configured
- [ ] CORS properly configured
- [ ] HTTPS enabled (automatic on Render)
- [ ] JWT secret is 32+ characters
- [ ] API keys rotated regularly
- [ ] Database backups enabled
- [ ] Rate limiting configured

---

## Support Resources

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Community Forum**: [community.render.com](https://community.render.com)
- **Status Page**: [status.render.com](https://status.render.com)

---

## Next Steps

1. ✅ Deploy frontend (Static Site)
2. ✅ Deploy backend (Web Service)
3. ✅ Deploy Redis (Cache)
4. ✅ Configure environment variables
5. ✅ Test API endpoints
6. ✅ Set up monitoring
7. ✅ Configure custom domain (optional)

Happy deploying! 🚀
