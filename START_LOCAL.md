# MindMix+ - Local Setup Guide

## ✅ What's Already Running

- Backend: http://localhost:4000
- Frontend: http://localhost:3000  
- Login endpoint: http://localhost:4000/auth/login

## 🚀 To Make It Public (Access from Any Network)

### Option 1: SSH Tunnel (Fastest)

1. **On your local machine:**
   ```bash
   # Backend tunnel
   npx localtunnel --port 4000
   # Copy the URL (e.g., https://random-name.loca.lt)
   ```

2. **In another terminal - Frontend tunnel:**
   ```bash
   npx localtunnel --port 3000
   # Copy the URL
   ```

3. **Update frontend API URL:**
   - Edit `frontend-web/src/config/api.js`
   - Set the first return statement to your backend tunnel URL
   - Example: `return 'https://random-name.loca.lt';`

4. Share both URLs!

### Option 2: Use Render.com (Alternative to Vercel)

1. Go to https://render.com
2. Sign up with GitHub
3. Create New → Web Service
4. Connect your GitHub repo
5. Settings:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment Variables:
     - `NODE_ENV=production`
     - `JWT_SECRET=any-random-string`
6. Deploy - Gets you a URL in 3 minutes!

## 🎯 Current Status

- ✅ Login works with ANY email/password
- ✅ No database needed
- ✅ Backend has demo mode enabled
- ✅ Runs perfectly on localhost

## 🌐 To Access From Mobile

1. Find your local IP:
   ```bash
   hostname -I
   # Example: 192.168.0.109
   ```

2. On mobile browser, go to:
   ```
   http://192.168.0.109:3000
   ```

3. Make sure mobile is on the same WiFi!

