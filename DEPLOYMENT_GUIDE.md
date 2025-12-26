# Deployment Guide for 24/7 School Platform

## Problem Solved
The issue was that React Router's client-side routing wasn't working on Netlify. When users tried to access `/admin` directly, they got a 404 error because Netlify was looking for a physical `/admin` folder instead of letting React Router handle the routing.

## Solution Implemented

### 1. Created `public/_redirects` file
```
/*    /index.html   200
```
This tells Netlify to serve `index.html` for all routes and let React Router handle the routing.

### 2. Created `netlify.toml` configuration
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 3. Updated `vite.config.ts`
Added proper build configuration for production deployment.

## How to Deploy

### Option 1: Automatic Deployment (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Netlify will automatically build and deploy using the `netlify.toml` configuration

### Option 2: Manual Deployment
1. Run `npm run build` to create the `dist` folder
2. Drag and drop the `dist` folder to Netlify's deploy area

## Verification
After deployment, these URLs should work:
- `https://24-7-school.netlify.app/` (Home page)
- `https://24-7-school.netlify.app/admin` (Admin panel)
- `https://24-7-school.netlify.app/lessons/math` (Math lessons)
- `https://24-7-school.netlify.app/lessons/english` (English lessons)
- `https://24-7-school.netlify.app/lessons/bangla` (Bangla lessons)
- `https://24-7-school.netlify.app/lessons/science` (Science lessons)

## Troubleshooting
If you still have issues:
1. Check Netlify's build logs
2. Ensure all environment variables are set in Netlify dashboard
3. Verify that the build command is `npm run build`
4. Make sure the publish directory is set to `dist`

## Environment Variables
Make sure these are set in Netlify dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

