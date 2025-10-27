# 📊 Where to View User Data & Logs

## 🎯 THREE WAYS TO VIEW USER DATA

---

## 1️⃣ MONGODB ATLAS (User Data Storage)

### **Where Your User Data is Stored:**
https://cloud.mongodb.com/

### **How to View User Data:**

**Step 1: Go to MongoDB Atlas**
1. Visit: https://cloud.mongodb.com/
2. Log in to your account

**Step 2: Open Database**
1. Click on your cluster
2. Click "Browse Collections"

**Step 3: View Users**
1. You'll see database: `mindmix`
2. Click on collection: `users`
3. See all registered users with:
   - Names
   - Emails (hashed passwords)
   - Stats (points, level, streak)
   - Creation dates

**What You'll See:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$10$... (hashed)",
  "stats": {
    "totalPoints": 100,
    "level": 5,
    "correctAnswers": 20,
    "wrongAnswers": 5,
    "streak": 3
  },
  "createdAt": "2025-10-27T...",
  "updatedAt": "2025-10-27T..."
}
```

---

## 2️⃣ RENDER BACKEND LOGS (Server Activity)

### **Where to See Server Logs:**
https://dashboard.render.com

### **How to View Logs:**

**Step 1: Go to Backend Service**
1. Visit: https://dashboard.render.com
2. Click on your backend service (Web Service, not Static Site)

**Step 2: View Logs**
1. Click "Logs" tab (left sidebar)
2. See real-time server logs

**What You'll See:**
```
✅ MongoDB Connected: cluster0-shard-00-01...
📊 Database: mindmix
🚀 AiLiveChallenge Backend running on port...
✅ NEW USER REGISTERED: user@example.com
✅ USER LOGGED IN: user@example.com
```

**Important Messages:**
- `✅ MongoDB Connected` = Database working
- `✅ NEW USER REGISTERED` = User created successfully
- `✅ USER LOGGED IN` = Login successful
- `⚠️  Database not connected` = MongoDB issue

---

## 3️⃣ BROWSER CONSOLE (Frontend Activity)

### **How to View Frontend Logs:**

**Step 1: Open Browser Console**
1. Open your app: https://mindmix-frontend.onrender.com
2. Press `F12` or `Right-click → Inspect`
3. Click "Console" tab

**Step 2: See What Happens**
- You'll see API calls
- Network requests
- Errors (if any)
- User activity

**What You'll See:**
```
🔗 API_URL value: https://mindmix-iuzf.onrender.com
📡 Full URL: https://mindmix-iuzf.onrender.com/auth/login
🌐 Window origin: https://mindmix-frontend.onrender.com
✅ Login successful!
```

---

## 📋 QUICK CHECKLIST

### **To Verify User Data is Saving:**

**1. Check MongoDB Atlas:**
- [ ] Go to: https://cloud.mongodb.com/
- [ ] Click "Browse Collections"
- [ ] Look in "users" collection
- [ ] See your registered users

**2. Check Render Logs:**
- [ ] Go to: https://dashboard.render.com
- [ ] Open backend service
- [ ] Click "Logs"
- [ ] Look for: `✅ NEW USER REGISTERED`

**3. Test Registration:**
- [ ] Go to: https://mindmix-frontend.onrender.com
- [ ] Register a new user
- [ ] Check MongoDB Atlas for the user
- [ ] Check Render logs for confirmation

---

## 🎯 WHAT TO LOOK FOR

### **Good Signs (Working):**
✅ `MongoDB Connected` in Render logs
✅ `NEW USER REGISTERED` message
✅ Users appear in MongoDB Atlas
✅ No errors in browser console
✅ Login/register works smoothly

### **Bad Signs (Not Working):**
❌ `Database not connected` in logs
❌ `DEMO MODE` messages
❌ No users in MongoDB Atlas
❌ Connection errors in browser
❌ Login fails with database errors

---

## 📊 MONITORING CHECKLIST

### **Daily Checks:**
- [ ] Check MongoDB Atlas for new users
- [ ] Check Render logs for errors
- [ ] Verify user stats are updating
- [ ] Check leaderboard data

### **Weekly Checks:**
- [ ] Review user growth
- [ ] Check database size
- [ ] Monitor performance
- [ ] Review error logs

---

## 🔧 TROUBLESHOOTING

### **If No Users in MongoDB:**
1. Check Render logs - database connected?
2. Check if MONGO_URI is set in Render
3. Verify MongoDB connection string
4. Check MongoDB Atlas network access (allow all IPs)

### **If "Database not connected":**
1. Verify MONGO_URI in Render environment
2. Check MongoDB Atlas is not paused
3. Check network access settings
4. Restart Render backend

### **Network Access in MongoDB Atlas:**
1. Go to: https://cloud.mongodb.com/
2. Click "Network Access" (left sidebar)
3. Add IP: `0.0.0.0/0` (allow all)
4. Click "Add IP Address"

---

## 📁 DATA YOU CAN VIEW

### **In MongoDB Atlas:**
- ✅ All registered users
- ✅ User stats (points, level, streaks)
- ✅ User passwords (hashed)
- ✅ Friends lists
- ✅ Achievements
- ✅ Timestamps (created, updated)

### **In Render Logs:**
- ✅ Login attempts
- ✅ Registration events
- ✅ API calls
- ✅ Errors
- ✅ Database connections
- ✅ Performance metrics

### **In Browser Console:**
- ✅ Frontend API calls
- ✅ Response data
- ✅ Errors
- ✅ Network requests
- ✅ User interactions

---

## 🎯 RECOMMENDED DAILY ROUTINE

1. **Morning:** Check MongoDB Atlas for new users overnight
2. **Check Render logs:** Any errors last night?
3. **Test registration:** Create test user
4. **Verify in Atlas:** User appears in database
5. **Check frontend:** Working smoothly?

**Total Time: 5 minutes daily**

---

## 📞 NEED HELP?

If you see issues:
1. Share screenshot of Render logs
2. Share what MongoDB Atlas shows
3. Share browser console errors
4. I'll help you troubleshoot!

---

## ✅ QUICK REFERENCE

**MongoDB Atlas:** https://cloud.mongodb.com/
- Browse → Collections → `users`
- See all user data

**Render Dashboard:** https://dashboard.render.com
- Backend service → Logs tab
- See server activity

**Browser Console:** F12 in your browser
- Console tab
- See frontend activity

