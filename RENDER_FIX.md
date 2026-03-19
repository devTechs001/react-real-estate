# Render Deployment Fix

## Problem
Your Render deployment is failing because:
1. The build command `npm install; npm run build` runs from root
2. But `vite` is only installed in `client/package.json`
3. Root `package.json` doesn't have vite as a dependency

## Solution

### Option 1: Fix Render Build Command (Recommended)

In Render Dashboard → Your Service → Settings:

**Build Command:**
```bash
cd client && npm install && npm run build
```

**Start Command:**
```bash
cd server && npm install && node server.js
```

### Option 2: Add vite to root package.json

If you want to build from root, add to root `package.json`:

```json
{
  "scripts": {
    "build": "cd client && npm install && npm run build"
  }
}
```

### Option 3: Use Separate Services

**Frontend (Static Site):**
- Create a new **Static Site** service on Render
- Repository: `https://github.com/devTechs001/virtual-touer`
- Build Command: `npm install && npm run build`
- Publish Directory: `client/dist`

**Backend (Web Service):**
- Create a new **Web Service** on Render
- Repository: `https://github.com/devTechs001/react-real-estate`
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `node server.js`

## Current Setup

Your repositories:
- **Main code**: https://github.com/devTechs001/react-real-estate
- **Deploying from**: https://github.com/devTechs001/virtual-touer

Make sure you're deploying from the correct repository!

## Quick Fix Steps

1. Go to Render Dashboard
2. Select your service: `virtual-touer-server`
3. Click **Settings**
4. Update **Build Command** to: `cd client && npm install && npm run build`
5. Update **Start Command** to: `cd server && npm install && node server.js`
6. Save Changes
7. Click **Manual Deploy** → **Deploy latest commit**
