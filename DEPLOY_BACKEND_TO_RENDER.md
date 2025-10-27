# 🚀 Deploy Backend to Render (Step-by-Step)

## 📋 Current Status

- ✅ Frontend is on Render: https://mindmix-frontend.onrender.com
- ⏳ Backend needs to be deployed to Render

---

## 🔧 Option 1: Already Have Backend on Render?

If you see "Web Service" in your dashboard, skip to "Add MongoDB" section below.

---

## 🔧 Option 2: Create New Backend Service

### Step 1: Create New Web Service
1. Go to: https://dashboard.render.com
2. Click **"New +"** button (top right)
3. Select **"Web Service"**
4. Click **"Connect GitHub"** or **"Connect Public Git repository"**

### Step 2: Configure Settings
```
Repository: Your GitHub repo (AiLiveChallenge)

Build Command:
cd backend && npm install

Start Command:
cd backend && node server.js

Environment: Node
```

### Step 3: Add Environment Variables
Click "Environment" tab and add:

```
MONGO_URI = mongodb+srv://nikhilshingane_db_user:nik.9696@cluster0.bdoe1k8.mongodb.net/mindmix?retryWrites=true&w=majority

JWT_SECRET = your-secret-key-here (generate a random string)

NODE_ENV = production
```

### Step 4: Deploy
Click **"Create Web Service"**
Wait 3-5 minutes for deployment

### Step 5: Get Backend URL
You'll get a URL like: `https://mindmix-backend-xxxxx.onrender.com`

---

## 🔧 Add MongoDB to Existing Backend

If you already have a backend service:

1. Go to your backend service in Render dashboard
2. Click **"Environment"** tab
3. Scroll to **"Environment Variables"** section
4. Click **"Add Environment Variable"**
5. Add:

**Key:** `MONGO_URI`

**Value:**
```
mongodb+srv://nikhilshingane_db_user:nik.9696@cluster0.bdoe1k8.mongodb.net/mindmix?retryWrites=true&w=majority
```

6. Click **"Save Changes"**
7. Render will automatically redeploy

---

## 🎯 After Adding MongoDB

1. Backend will auto-redeploy
2. I'll update the code to use real database
3. Test the connection
4. Done!

**Let me know when you've added MONGO_URI to Render!**

