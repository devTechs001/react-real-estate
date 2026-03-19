# Render Deployment Fix (Server Only)

## Problem
Your Render deployment was failing because the build command was trying to build the client, but you only want to deploy the server.

## Solution - Server Only Deployment

In Render Dashboard → Your Service → Settings:

**Build Command:**
```bash
cd server && npm install
```

**Start Command:**
```bash
cd server && node server.js
```

**Root Directory:**
```
server
```

## Architecture

| Platform | Purpose | Repository |
|----------|---------|------------|
| **Netlify** | Frontend (React/Vite) | `https://github.com/devTechs001/virtual-touer` |
| **Render** | Backend (Express/Node) | `https://github.com/devTechs001/react-real-estate` |

## Quick Fix Steps

1. Go to Render Dashboard
2. Select your service: `virtual-touer-server`
3. Click **Settings**
4. Update **Root Directory** to: `server`
5. Update **Build Command** to: `cd server && npm install`
6. Update **Start Command** to: `cd server && node server.js`
7. Save Changes
8. Click **Manual Deploy** → **Deploy latest commit**

## Environment Variables on Render

Add these to Render (Settings → Environment):

```bash
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://virtual-touer.netlify.app
MONGODB_URI=mongodb+srv://devtechs842_db_user:<password>@cluster0.kparor6.mongodb.net/virtual-tour?retryWrites=true&w=majority&appName=virtual-tour
JWT_SECRET=<generate_64_char_random>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
OPENAI_API_KEY=sk-proj-<your_key>
```

## Test Your Backend

After deployment, test:
```bash
curl https://virtual-touer-server.onrender.com/api/health
```
