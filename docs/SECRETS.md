# Secrets Management Guide

Comprehensive guide for managing secrets and environment variables in the Real Estate Platform.

## Table of Contents

- [Overview](#overview)
- [Environment Variables by Service](#environment-variables-by-service)
- [Secrets Generation](#secrets-generation)
- [Storage Best Practices](#storage-best-practices)
- [Platform-Specific Configuration](#platform-specific-configuration)
- [Security Checklist](#security-checklist)

---

## Overview

This application uses environment variables for configuration. **Never commit secrets to version control.**

### Files Structure

```
.env                    # Root level (rarely used)
server/.env            # Backend secrets
client/.env            # Frontend configuration (non-sensitive)
```

---

## Environment Variables by Service

### Backend (server/.env)

#### Database

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` | ✅ |
| `MONGO_URI` | Alternative MongoDB URI | Same as above | ⚠️ |

#### Authentication

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your_super_secret_key_min_32_characters_long` | ✅ |
| `JWT_EXPIRE` | JWT token expiration | `30d` | ✅ |

#### Cloudinary (Image Upload)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `dxxxxx` | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdefghijklmnop` | ✅ |

#### Email (SMTP)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` | ⚠️ |
| `EMAIL_PORT` | SMTP port | `587` | ⚠️ |
| `EMAIL_USER` | SMTP username | `your_email@gmail.com` | ⚠️ |
| `EMAIL_PASSWORD` | SMTP password/app password | `xxxx-xxxx-xxxx-xxxx` | ⚠️ |
| `EMAIL_FROM` | From email address | `noreply@realestateapp.com` | ⚠️ |

#### Stripe (Payments)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_xxx` or `sk_live_xxx` | ✅ |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_xxx` or `pk_live_xxx` | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_xxx` | ✅ |
| `STRIPE_BASIC_PRICE_ID` | Basic plan price ID | `price_xxx` | ⚠️ |
| `STRIPE_PRO_PRICE_ID` | Pro plan price ID | `price_xxx` | ⚠️ |
| `STRIPE_PREMIUM_PRICE_ID` | Premium plan price ID | `price_xxx` | ⚠️ |

#### OpenAI (AI Features)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key | `sk-xxxxx` | ✅ |
| `OPENAI_MODEL` | Default AI model | `gpt-4-turbo-preview` | ⚠️ |
| `OPENAI_VISION_MODEL` | Vision model for image analysis | `gpt-4-vision-preview` | ⚠️ |

#### Google Cloud (Optional)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `GOOGLE_CLOUD_PROJECT_ID` | Google Cloud project ID | `my-project` | ⚠️ |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account key | `path/to/credentials.json` | ⚠️ |

#### Redis (Caching)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` | ⚠️ |
| `REDIS_PASSWORD` | Redis password (if required) | `your_password` | ⚠️ |

#### Application

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment | `development` or `production` | ✅ |
| `PORT` | Server port | `5000` | ✅ |
| `CLIENT_URL` | Frontend URL | `http://localhost:5174` | ✅ |
| `PRODUCTION_URL` | Production frontend URL | `https://app.example.com` | ⚠️ |

#### AI Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `AI_CHATBOT_ENABLED` | Enable AI chatbot | `true` | ⚠️ |
| `AI_PRICE_PREDICTION_ENABLED` | Enable price prediction | `true` | ⚠️ |
| `AI_FRAUD_DETECTION_ENABLED` | Enable fraud detection | `true` | ⚠️ |
| `AI_IMAGE_ANALYSIS_ENABLED` | Enable image analysis | `true` | ⚠️ |
| `AI_RECOMMENDATIONS_ENABLED` | Enable recommendations | `true` | ⚠️ |
| `AI_REQUESTS_PER_HOUR` | Rate limit per hour | `100` | ⚠️ |
| `AI_REQUESTS_PER_DAY` | Rate limit per day | `1000` | ⚠️ |

---

### Frontend (client/.env)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` | ✅ |
| `VITE_SOCKET_URL` | WebSocket server URL | `http://localhost:5000` | ✅ |
| `VITE_MAPBOX_ACCESS_TOKEN` | Mapbox access token | `pk.xxxxx` | ⚠️ |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | `AIzaxxxxx` | ⚠️ |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key | `pk_test_xxx` | ⚠️ |

**Note**: Frontend variables starting with `VITE_` are exposed to the browser. **Never put secrets here!**

---

## Secrets Generation

### JWT Secret

```bash
# Generate a secure random secret
openssl rand -base64 32
# or
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy publishable key (starts with `pk_`)
3. Copy secret key (starts with `sk_`)
4. For webhooks, create endpoint and copy signing secret (starts with `whsec_`)

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy immediately (won't be shown again)

### Cloudinary Credentials

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Find Account Details
3. Copy Cloud Name, API Key, and API Secret

### Mapbox Access Token

1. Go to [Mapbox Account](https://account.mapbox.com/)
2. Copy default public token or create new one

### Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project or select existing
3. Enable Maps JavaScript API
4. Create credentials → API Key

---

## Storage Best Practices

### ✅ DO

- Use environment variables for all secrets
- Use `.env` files locally (never commit them)
- Use secret management services in production
- Rotate secrets regularly
- Use different secrets per environment
- Add `.env` to `.gitignore`

### ❌ DON'T

- Never commit `.env` files to Git
- Never hardcode secrets in source code
- Never share secrets via chat/email
- Never use production secrets in development
- Never log sensitive values

### .gitignore

```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Server
server/.env
server/.env.local

# Client
client/.env
client/.env.local

# IDE
.vscode/
.idea/

# Dependencies
node_modules/

# Build outputs
dist/
build/
```

---

## Platform-Specific Configuration

### Render

Set environment variables in the Render Dashboard:

1. Go to service → Environment
2. Click "Add Environment Variable"
3. For secrets, use `sync: false` in render.yaml

```yaml
envVars:
  - key: MONGODB_URI
    sync: false  # Set manually in dashboard
  - key: JWT_SECRET
    sync: false
```

### Netlify

Set environment variables in Netlify Dashboard:

1. Site settings → Environment variables
2. Add key-value pairs
3. Different values per context (dev/staging/prod)

### GitHub Actions

Use GitHub Secrets:

1. Repository Settings → Secrets and variables → Actions
2. New repository secret
3. Reference in workflow: `${{ secrets.SECRET_NAME }}`

### Docker

Use Docker secrets or environment files:

```yaml
# docker-compose.yml
services:
  server:
    env_file:
      - .env.production
    secrets:
      - jwt_secret

secrets:
  jwt_secret:
    external: true
```

### Kubernetes

Use Kubernetes Secrets:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  jwt-secret: your-secret-key
  mongodb-uri: mongodb://...
```

---

## Security Checklist

### Development

- [ ] `.env` files are in `.gitignore`
- [ ] No secrets in source code
- [ ] Using separate secrets for dev/prod
- [ ] Secrets are sufficiently random (min 32 chars for JWT)

### Production

- [ ] Using environment-specific secrets
- [ ] Secrets stored in secure vault/manager
- [ ] HTTPS enabled everywhere
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Database credentials restricted by IP

### Monitoring

- [ ] Logging enabled (without sensitive data)
- [ ] Alert on suspicious activity
- [ ] Regular security audits
- [ ] Secret rotation schedule defined

### Incident Response

- [ ] Plan for compromised secrets
- [ ] Ability to rotate all secrets quickly
- [ ] Backup authentication methods
- [ ] Communication plan for users

---

## Quick Setup Scripts

### Development Setup

```bash
# Create .env from template
cp server/.env.example server/.env
cp client/.env.example client/.env

# Generate JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "JWT_SECRET=$JWT_SECRET" >> server/.env
```

### Production Deployment

```bash
# Export all required variables
export MONGODB_URI="mongodb+srv://..."
export JWT_SECRET=$(openssl rand -base64 32)
export STRIPE_SECRET_KEY="sk_live_..."
export OPENAI_API_KEY="sk-..."
export CLOUDINARY_CLOUD_NAME="..."
export CLOUDINARY_API_KEY="..."
export CLOUDINARY_API_SECRET="..."

# Start server
npm start
```

---

## Troubleshooting

### Common Issues

**Issue**: `JWT_SECRET must be at least 32 characters`
```bash
# Solution: Generate longer secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Issue**: `MongoDB connection failed`
```bash
# Check:
# 1. Connection string is correct
# 2. IP whitelist includes your server
# 3. Database user has proper permissions
```

**Issue**: `Stripe webhook signature invalid`
```bash
# Check:
# 1. STRIPE_WEBHOOK_SECRET matches dashboard
# 2. Using raw body middleware for webhook route
# 3. Webhook endpoint is publicly accessible
```

---

## Resources

- [12-Factor App: Config](https://12factor.net/config)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/)

---

**Last Updated**: March 7, 2026
**Version**: 1.0.0
