# 🚀 Deploy MindMix+ to Vercel

## Step-by-Step Deployment Guide

### Prerequisites
- Node.js installed
- npm installed
- GitHub account (free)

---

## Option A: Deploy via GitHub (Recommended)

### 1. Push to GitHub
```bash
cd /home/lenovo/AiLiveChallenge
git init
git add .
git commit -m "MindMix+ App"
git branch -M main

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR-USERNAME/mindmix.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repo
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend-web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
5. Click "Deploy"
6. Get URL like: `https://your-app.vercel.app`

### 3. Deploy Backend
1. Go to Vercel dashboard
2. Click "Add New Project"
3. Import same repo
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Deploy!
6. Get URL like: `https://your-app-api.vercel.app`

---

## Option B: Deploy via CLI (Quick)

### 1. Install Vercel CLI
```bash
npm install -g vercel
# OR
npx vercel
```

### 2. Deploy Frontend
```bash
cd /home/lenovo/AiLiveChallenge/frontend-web
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? (choose your account)
- Link to existing project? **N**
- Project name? **mindmix-frontend**
- Directory? **./** (press enter)
- Override settings? **N**

Wait 2 minutes... ✅ Deployed!

### 3. Deploy Backend
```bash
cd /home/lenovo/AiLiveChallenge/backend
vercel
```

Same prompts, use name: `mindmix-backend`

### 4. Update Frontend API URL
After backend deploys, update `frontend-web/src/config/api.js`:
```javascript
export default 'https://mindmix-backend.vercel.app';
```

Then redeploy frontend:
```bash
cd frontend-web
vercel --prod
```

---

## Environment Variables

### Backend (.env)
Add these in Vercel dashboard → Settings → Environment Variables:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
PORT=3000
NODE_ENV=production
```

### How to Add:
1. Go to Vercel dashboard
2. Select your backend project
3. Settings → Environment Variables
4. Add each variable
5. Redeploy

---

## Result

✅ **Frontend:** https://mindmix-frontend.vercel.app
✅ **Backend:** https://mindmix-backend.vercel.app

Your app is LIVE 24/7! 🎉

---

## Troubleshooting

**Build fails?**
- Check Node version (use 18.x)
- Add `build` script to package.json

**Backend not working?**
- Check environment variables
- Verify MongoDB connection
- Check logs in Vercel dashboard

**CORS errors?**
- Backend already has CORS enabled
- Should work automatically

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Add environment variables
3. ✅ Test from any network
4. ✅ Share your URL!

**Your app is permanently online!**

