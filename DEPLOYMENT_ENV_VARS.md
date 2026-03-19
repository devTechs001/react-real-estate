# Deployment Environment Variables Guide

**Live Site**: https://virtualtourist.netlify.app/

This guide provides all environment variables needed to deploy the Real Estate Application on **Render** (backend) and **Netlify** (frontend).

---

## 🌐 Netlify (Frontend)

### Required Environment Variables

Add these in **Netlify Dashboard** → Site Settings → Environment Variables:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.onrender.com` |
| `VITE_ENABLE_AI_FEATURES` | Enable AI features (optional) | `true` |
| `VITE_ENABLE_CHAT` | Enable chat feature (optional) | `true` |

### Optional Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics tracking ID | `G-XXXXXXXXXX` |
| `VITE_SENTRY_DSN` | Sentry error tracking DSN | `https://xxx@sentry.io/xxx` |
| `VITE_MAPBOX_TOKEN` | Mapbox token (if using instead of Leaflet) | `pk.xxxxx` |

### Build Settings

```toml
# netlify.toml (already configured)
[build]
  command = "cd client && pnpm install --ignore-workspace --prefer-offline && pnpm run build"
  publish = "client/dist"

[build.environment]
  NODE_VERSION = "18"
  PNPM_VERSION = "8.6.0"
```

---

## 🚀 Render (Backend)

### Required Environment Variables

Add these in **Render Dashboard** → Web Service → Environment:

| Variable | Description | How to Get | Example |
|----------|-------------|------------|---------|
| `NODE_ENV` | Environment | Set manually | `production` |
| `PORT` | Server port | Set manually | `3000` |
| `MONGODB_URI` | MongoDB connection | [MongoDB Atlas](https://cloud.mongodb.com) | `mongodb+srv://devtechs842_db_user:<password>@cluster0.kparor6.mongodb.net/virtual-tour?retryWrites=true&w=majority&appName=virtual-tour` |
| `JWT_SECRET` | JWT signing secret | Generate: `openssl rand -hex 32` | `a1b2c3d4...` (64 chars) |
| `FRONTEND_URL` | Frontend URL for CORS | Your Netlify URL | `https://virtualtourist.netlify.app` |

### Cloudinary (Image Uploads)

| Variable | Description | How to Get | Example |
|----------|-------------|------------|---------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name | [Cloudinary Dashboard](https://cloudinary.com) | `dxxxxx` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Cloudinary Dashboard | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Cloudinary Dashboard | `abcdefghijklmnop` |

### OpenAI (AI Features)

| Variable | Description | How to Get | Example |
|----------|-------------|------------|---------|
| `OPENAI_API_KEY` | OpenAI API key | [OpenAI Platform](https://platform.openai.com/api-keys) | `sk-proj-xxxxx` |
| `OPENAI_MODEL` | GPT model | Set manually | `gpt-4-turbo-preview` |
| `OPENAI_VISION_MODEL` | Vision model | Set manually | `gpt-4-vision-preview` |

### Stripe (Payments)

| Variable | Description | How to Get | Example |
|----------|-------------|------------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key | [Stripe Dashboard](https://dashboard.stripe.com) | `sk_live_xxxxx` or `sk_test_xxxxx` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Stripe Dashboard | `pk_live_xxxxx` or `pk_test_xxxxx` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Stripe CLI or Dashboard | `whsec_xxxxx` |
| `STRIPE_PRO_PRICE_ID` | Pro plan price ID | Stripe Products | `price_xxxxx` |
| `STRIPE_PREMIUM_PRICE_ID` | Premium plan price ID | Stripe Products | `price_xxxxx` |

### Email (SMTP)

| Variable | Description | How to Get | Example |
|----------|-------------|------------|---------|
| `SMTP_HOST` | SMTP server | Email provider | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | Email provider | `587` |
| `SMTP_USER` | SMTP username | Email provider | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password | Email provider (App Password) | `xxxx xxxx xxxx xxxx` |
| `EMAIL_FROM` | Sender email | Set manually | `noreply@yourdomain.com` |

### Redis (Caching & Rate Limiting)

| Variable | Description | How to Get | Example |
|----------|-------------|------------|---------|
| `REDIS_HOST` | Redis host | [Redis Cloud](https://redis.com) or [Upstash](https://upstash.com) | `redis.upstash.io` |
| `REDIS_PORT` | Redis port | Redis provider | `6379` |
| `REDIS_PASSWORD` | Redis password | Redis provider | `xxxxx` |
| `REDIS_URL` | Full Redis URL | Redis provider | `redis://default:pass@host:port` |

### Google Cloud Vision (Image Analysis)

| Variable | Description | How to Get | Example |
|----------|-------------|------------|---------|
| `GOOGLE_CLOUD_PROJECT_ID` | GCP project ID | [Google Cloud Console](https://console.cloud.google.com) | `my-project-123` |
| `GOOGLE_CLOUD_CREDENTIALS` | Service account JSON | GCP → IAM → Service Accounts | `{ "type": "service_account", ... }` |

### Rate Limiting

| Variable | Description | Example |
|----------|-------------|---------|
| `RATE_LIMIT_WINDOW_MS` | Time window in ms | `900000` (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

### File Upload

| Variable | Description | Example |
|----------|-------------|---------|
| `MAX_FILE_SIZE` | Max upload size in bytes | `5242880` (5MB) |
| `UPLOAD_PATH` | Upload directory | `./uploads` |

---

## 📋 Quick Setup Checklist

### 1. MongoDB Atlas (Required)
- [ ] Create cluster at [MongoDB Atlas](https://cloud.mongodb.com)
- [ ] Create database user
- [ ] Whitelist IP: `0.0.0.0/0` (for Render)
- [ ] Get connection string

### 2. Cloudinary (Required for Images)
- [ ] Create account at [Cloudinary](https://cloudinary.com)
- [ ] Get cloud name, API key, and secret
- [ ] Note: Free tier includes 25GB storage

### 3. OpenAI (Required for AI Features)
- [ ] Create account at [OpenAI Platform](https://platform.openai.com)
- [ ] Generate API key
- [ ] Add billing (required for API access)

### 4. Stripe (Optional - for Premium Features)
- [ ] Create account at [Stripe](https://stripe.com)
- [ ] Get API keys (test mode for development)
- [ ] Create products and prices

### 5. Email (Optional - for Notifications)
- [ ] Use Gmail with App Password or [SendGrid](https://sendgrid.com)
- [ ] Generate app-specific password (Gmail)
- [ ] Configure SMTP settings

### 6. Redis (Optional - for Performance)
- [ ] Create account at [Upstash](https://upstash.com) (free tier available)
- [ ] Get Redis connection URL

### 7. Google Cloud (Optional - for Image Analysis)
- [ ] Create project at [Google Cloud Console](https://console.cloud.google.com)
- [ ] Enable Vision API
- [ ] Create service account and download JSON credentials

---

## 🔧 Render Service Setup

### Step 1: Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `real-estate-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `cd server && pnpm install`
   - **Start Command**: `cd server && pnpm start`
   - **Instance Type**: Free or $7/month (always-on)

### Step 2: Add Environment Variables
Copy all variables from the **Backend** section above into Render's Environment tab.

### Step 3: Deploy
- Click **Create Web Service**
- Wait for deployment (check Logs tab)
- Copy the service URL (e.g., `https://real-estate-api.onrender.com`)

### Step 4: Update Netlify
- Add `VITE_API_URL=https://real-estate-api.onrender.com` to Netlify environment
- Trigger new deployment in Netlify

---

## 📝 Environment File Templates

### Frontend (.env.example)
```bash
VITE_API_URL=https://your-backend.onrender.com
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_CHAT=true
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Backend (.env.example)
```bash
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://virtualtourist.netlify.app
MONGODB_URI=mongodb+srv://devtechs842_db_user:<your_password_here>@cluster0.kparor6.mongodb.net/virtual-tour?retryWrites=true&w=majority&appName=virtual-tour
JWT_SECRET=generate_with_openssl_rand_hex_32
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=sk-proj-your_key_here
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_VISION_MODEL=gpt-4-vision-preview
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_PREMIUM_PRICE_ID=price_xxx
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
REDIS_HOST=redis.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_URL=redis://default:password@host:port
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_CREDENTIALS={"type":"service_account",...}
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

---

## 🔍 Troubleshooting

### Frontend Issues

**"Cannot connect to API"**
- Check `VITE_API_URL` is correct and accessible
- Ensure backend CORS allows your Netlify URL
- Test API URL in browser: `https://your-backend.onrender.com/api/health`

**Build fails on Netlify**
- Check build logs in Netlify Dashboard
- Verify `pnpm-lock.yaml` is committed
- Clear cache and retry: **Deploys** → **Trigger deploy** → **Clear cache and deploy**

### Backend Issues

**"Cannot connect to MongoDB"**
- Verify MongoDB URI is correct (format: `mongodb+srv://devtechs842_db_user:<password>@cluster0.kparor6.mongodb.net/virtual-tour?retryWrites=true&w=majority&appName=virtual-tour`)
- Replace `<password>` with your actual database user password
- Check IP whitelist includes Render IPs (0.0.0.0/0 for all IPs)
- Ensure database user has correct permissions

**"OpenAI API error"**
- Verify API key is valid
- Check billing is enabled on OpenAI account
- Ensure API key has correct permissions

**"Cloudinary upload failed"**
- Verify all three Cloudinary credentials
- Check Cloudinary account is active
- Test upload manually via Cloudinary dashboard

**Service keeps sleeping (Render Free Tier)**
- Upgrade to $7/month plan for always-on
- Use [UptimeRobot](https://uptimerobot.com) to ping every 5 minutes (not recommended for production)

---

## 📊 API Health Check

After deployment, verify your backend is working:

```bash
# Test health endpoint
curl https://your-backend.onrender.com/api/health

# Test detailed health
curl https://your-backend.onrender.com/api/health/detailed
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-03-19T...",
  "uptime": "...",
  "environment": "production"
}
```

---

## 🎯 Production Checklist

- [ ] MongoDB Atlas cluster created and accessible
- [ ] All required environment variables set on Render
- [ ] All required environment variables set on Netlify
- [ ] Backend health endpoint responds successfully
- [ ] Frontend can connect to backend API
- [ ] Image uploads working (test property creation)
- [ ] User registration/login working
- [ ] CORS configured correctly (FRONTEND_URL matches Netlify)
- [ ] JWT_SECRET is secure (random 64-character string)
- [ ] HTTPS enabled on both services (automatic on both platforms)
- [ ] Error logging configured (optional: Sentry)
- [ ] Analytics configured (optional: Google Analytics)

---

## 🔗 Useful Links

- **Netlify Dashboard**: https://app.netlify.com
- **Render Dashboard**: https://dashboard.render.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Cloudinary**: https://cloudinary.com
- **OpenAI Platform**: https://platform.openai.com
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Upstash Redis**: https://upstash.com
- **Google Cloud Console**: https://console.cloud.google.com

---

**Live Frontend**: https://virtualtourist.netlify.app/

**Support**: Check logs in respective dashboards for deployment issues.
