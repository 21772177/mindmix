# 🚀 Deployment Guide - Deploy AiLiveChallenge to Production

## 📋 Pre-Deployment Checklist

### ✅ What's Ready
- [x] Backend code complete
- [x] Frontend React app built
- [x] MongoDB Atlas configured
- [x] Environment variables set up
- [x] API endpoints tested
- [x] Authentication working

### ⏳ What Needs Setup
- [ ] OpenAI billing (for real AI challenges)
- [ ] Production hosting accounts
- [ ] Domain name (optional)
- [ ] SSL certificates (auto with hosting)

---

## 🎯 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) ⭐ Recommended

#### Deploy Frontend to Vercel (Free)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend-web
vercel

# Add environment variables:
# REACT_APP_API_URL=https://your-backend.railway.app
```

#### Deploy Backend to Railway (Paid/Free Trial)
1. Go to: https://railway.app
2. Click "New Project"
3. Connect GitHub repo or upload code
4. Add environment variables:
   - `MONGO_URI` (your Atlas connection string)
   - `JWT_SECRET` (generate a new one)
   - `OPENAI_API_KEY` (your key)
   - `NODE_ENV=production`
5. Deploy!

**Cost**: Free trial, then ~$5/month

---

### Option 2: Render.com (Both Frontend + Backend) ⭐ Easiest

#### Backend
1. Go to: https://render.com
2. Create new "Web Service"
3. Connect GitHub repo
4. Select `backend` folder
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variables

#### Frontend
1. Create new "Static Site"
2. Connect GitHub repo
3. Select `frontend-web` folder
4. Build command: `npm install && npm run build`
5. Add environment variable: `REACT_APP_API_URL`

**Cost**: Free tier available

---

### Option 3: Netlify (Frontend) + Railway (Backend)

#### Frontend to Netlify
1. Go to: https://netlify.com
2. Click "Add new site"
3. Connect GitHub
4. Build settings:
   - Base: `frontend-web`
   - Build: `npm run build`
   - Publish: `build`
5. Add environment: `REACT_APP_API_URL`

---

## 📝 Environment Variables

### Backend (.env in production)
```env
PORT=4000
NODE_ENV=production
MONGO_URI=mongodb+srv://your-atlas-connection
JWT_SECRET=your-production-secret-key
JWT_EXPIRE=30d
OPENAI_API_KEY=your-openai-key
```

### Frontend (Set in hosting platform)
```
REACT_APP_API_URL=https://your-backend-url.com
```

---

## 🔒 Security Checklist

- [ ] Use strong JWT_SECRET in production
- [ ] MongoDB Atlas whitelist production IPs only
- [ ] Enable HTTPS on both frontend and backend
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Add error logging (Sentry)
- [ ] Set up monitoring

---

## 🎯 Step-by-Step: Railway + Vercel

### 1. Prepare Backend for Railway
```bash
# Update backend/.env with production secrets
cd backend

# Generate new JWT secret
openssl rand -base64 32

# Update .env
NODE_ENV=production
PORT=4000
MONGO_URI=your-production-uri
JWT_SECRET=new-production-secret
```

### 2. Deploy Backend to Railway
- Push code to GitHub
- Go to: https://railway.app/new
- Connect GitHub repo
- Railway auto-detects Node.js
- Add environment variables
- Deploy!

### 3. Deploy Frontend to Vercel
```bash
cd frontend-web
vercel

# Set environment variable
vercel env add REACT_APP_API_URL
# Enter: https://your-app.railway.app
```

---

## 📊 Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Test user registration
- [ ] Test user login
- [ ] Test challenge generation
- [ ] Check MongoDB connection
- [ ] Verify HTTPS working
- [ ] Test frontend -> backend communication
- [ ] Monitor server logs

---

## 🆘 Troubleshooting

### Database Connection Issues
- Check MongoDB Atlas IP whitelist
- Add Railway IP to Atlas
- Verify connection string

### CORS Errors
- Update CORS in backend server.js
- Add production frontend URL

### Environment Variables
- Check variables are set correctly
- Restart services after changes
- Verify variable names match

---

## 💰 Cost Estimate

| Service | Monthly Cost |
|---------|-------------|
| MongoDB Atlas | FREE (512MB) |
| Railway (Backend) | $5 or free tier |
| Vercel (Frontend) | FREE |
| OpenAI API | Pay per use |
| **Total** | ~$5/month |

---

## 🎉 Quick Deploy Commands

### One-Line Backend Deploy
```bash
# Push to GitHub first
git add .
git commit -m "Ready for production"
git push origin main

# Then deploy via Railway web UI
```

### Frontend Deploy
```bash
cd frontend-web
npm run build
vercel --prod
```

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
