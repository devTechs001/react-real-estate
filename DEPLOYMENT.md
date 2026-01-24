# Deployment Guide

This document covers deployment options for the Real Estate Application across multiple platforms.

## Table of Contents

- [Netlify](#netlify)
- [Render](#render)
- [GitHub Pages](#github-pages)
- [Local Development](#local-development)

## Netlify

### Overview
Netlify provides free hosting for static sites with continuous deployment and serverless functions.

### Setup Instructions

1. **Create Netlify Account**
   - Visit [netlify.com](https://www.netlify.com)
   - Sign up with GitHub

2. **Connect Repository**
   - Click "New site from Git"
   - Select GitHub and authorize
   - Choose the `react-real-estate` repository

3. **Configure Build Settings**
   - Build command: `pnpm run build`
   - Publish directory: `client/dist`
   - Node version: 18

4. **Set Environment Variables**
   Go to Site settings → Build & deploy → Environment and add:
   ```
   VITE_API_URL=https://api.yourdomain.com
   VITE_GOOGLE_MAPS_API_KEY=your_key
   ```

5. **Deploy**
   - Netlify will automatically deploy on push to `main` branch
   - Preview deployments for all PRs

### Features
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Continuous deployment
- ✅ Form handling
- ✅ Serverless functions support
- ✅ Split testing
- ✅ Immediate rollbacks

### Configuration File
- `netlify.toml` - Contains build settings, redirects, and headers

## Render

### Overview
Render offers full-stack deployment with support for both frontend and backend services.

### Frontend Deployment

1. **Create Static Site**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Static Site"
   - Connect GitHub repository
   - Set build command: `cd client && pnpm install && pnpm run build`
   - Set publish directory: `client/dist`

2. **Configure**
   - Environment: Node 18
   - Auto-deploy from main branch

### Backend Deployment

1. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Select Node as runtime
   - Set start command: `cd server && pnpm start`
   - Environment: Node 18.0.0

2. **Add Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   CLOUDINARY_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   OPENAI_API_KEY=your_key
   REDIS_URL=your_redis_url
   ```

3. **Connect Services**
   - Get backend service URL from Render
   - Add to frontend environment: `VITE_API_URL=backend_url`

### Configuration File
- `render.yaml` - Contains full deployment configuration

### Free Tier
- Frontend: Unlimited (auto-sleeps after 15 mins of inactivity)
- Backend: $7/month minimum (needs always-on for production)

## GitHub Pages

### Overview
GitHub Pages is perfect for static site hosting directly from your repository.

### Setup Instructions

1. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Under "Build and deployment":
     - Source: GitHub Actions
     - Branch: main

2. **Workflow**
   - `.github/workflows/deploy-gh-pages.yml` handles automatic deployment
   - Builds on every push to `main` branch
   - Deploys to `https://username.github.io/react-real-estate`

3. **Configure Base URL**
   - Update `vite.config.js` if needed:
   ```javascript
   export default {
     base: '/react-real-estate/', // if repo name is different
   }
   ```

### Features
- ✅ Free hosting
- ✅ GitHub-native
- ✅ No build time limits
- ✅ Automatic HTTPS
- ⚠️ Static sites only
- ⚠️ Public repository required (free tier)

### Workflow File
- `.github/workflows/deploy-gh-pages.yml` - Handles the deployment

## CI/CD Pipeline

### GitHub Actions Workflow

The `.github/workflows/ci-cd.yml` file provides:

1. **Lint & Type Check**
   - Runs on all branches
   - ESLint validation (when available)
   - TypeScript type checking

2. **Build**
   - Compiles the application
   - Uploads build artifact
   - Keeps artifacts for 7 days

3. **Security Checks**
   - npm audit
   - Dependency vulnerability scanning
   - Runs on all pushes

4. **Automated Deployments**
   - Staging: Deploy to Netlify on `develop` branch push
   - Production: Deploy to Netlify on `main` branch push
   - Requires GitHub secrets configuration

### GitHub Secrets Setup

For automated deployments, add these secrets in repository Settings:

```
NETLIFY_AUTH_TOKEN     - From Netlify (User Settings → Applications)
NETLIFY_SITE_ID        - Production site ID
NETLIFY_SITE_ID_STAGING - Staging site ID
```

## Local Development

### Prerequisites
```bash
# Node.js 18+
# pnpm 8.6.0+
```

### Installation

```bash
# Install dependencies
pnpm install

# or install all (root, client, server)
pnpm run install:all
```

### Development Server

```bash
# Run both client and server
pnpm run dev

# Or run separately
pnpm run client    # Vite on localhost:5173
pnpm run server    # Express on localhost:3000
```

### Building

```bash
# Build client
pnpm run build

# Build server
pnpm run build:server
```

### Cleaning

```bash
# Clean node_modules and reinstall
pnpm run clean:install
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_key
```

### Backend (.env)
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/real-estate
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
OPENAI_API_KEY=your_key
REDIS_URL=redis://localhost:6379
```

## Troubleshooting

### Build Failures
- Clear cache: `pnpm store prune`
- Reinstall: `pnpm run clean:install`
- Check Node version: `node --version` (should be 18+)

### Deployment Issues

**Netlify**
- Check build logs in Deploy tab
- Verify environment variables are set
- Ensure publish directory is correct

**Render**
- Check logs in Service dashboard
- Verify environment variables
- Check network connectivity to external services

**GitHub Pages**
- Verify workflow is enabled
- Check Actions tab for workflow runs
- Ensure branch is set correctly

## Performance Optimization

1. **Code Splitting**
   - Use dynamic imports for large components
   - Vite handles automatic code splitting

2. **Image Optimization**
   - Use Unsplash URLs (already optimized)
   - Consider adding image optimization service

3. **Bundle Size**
   - Monitor with `npm run build`
   - Use dynamic imports for routes
   - Remove unused dependencies

## Security Checklist

- [ ] Environment variables not in code
- [ ] API keys properly secured
- [ ] HTTPS enabled on all domains
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Sensitive data encrypted

## Support

For deployment-specific questions:
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Render**: [render.com/docs](https://render.com/docs)
- **GitHub Pages**: [pages.github.com](https://pages.github.com)

## Next Steps

1. Choose your deployment platform
2. Follow the setup instructions above
3. Set up GitHub secrets for CI/CD
4. Test deployment with a PR
5. Monitor the deployment logs

Happy deploying! 🚀
