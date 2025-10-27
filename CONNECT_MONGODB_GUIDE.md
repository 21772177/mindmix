# 🔧 Connect MongoDB to Your App

## 📋 What You Need

1. ✅ MongoDB Atlas account
2. ⏳ Connection string
3. ⏳ Add to Render
4. ⏳ Update backend code

---

## 🔧 STEP 1: Get Your MongoDB Connection String

### From MongoDB Atlas:

1. Go to: https://cloud.mongodb.com/
2. Login to your account
3. Click on your **cluster** (it should be running)
4. Click the **"Connect"** button (green button)
5. Choose **"Connect your application"**
6. Copy the connection string

### Format Example:
```
mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Important:
- Replace `<password>` with your MongoDB password
- Add database name at the end: `/mindmix`

### Final Format Should Look Like:
```
mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/mindmix?retryWrites=true&w=majority
```

---

## 🔧 STEP 2: Add to Render Environment Variables

1. Go to: https://dashboard.render.com
2. Click on your backend service: **mindmix-iuzf**
3. Go to **"Environment"** section
4. Click **"Add Environment Variable"**
5. Add:
   - **Key:** `MONGODB_URI`
   - **Value:** `(paste your connection string here)`
6. Click **"Save Changes"**
7. Render will auto-redeploy

---

## 🔧 STEP 3: Update Backend Code

I'll update the backend to use MongoDB. Need to:
1. Install mongoose in backend
2. Create User model
3. Update auth routes
4. Connect to database

**Tell me when you've added the connection string to Render!**

---

## 🎯 Quick Checklist

- [ ] Got connection string from MongoDB Atlas
- [ ] Added to Render environment variables
- [ ] Confirmed variable name is `MONGODB_URI`
- [ ] Ready for me to update backend code

---

## 🚀 Next Steps After You Add String:

I will:
1. Install mongoose package
2. Create User model
3. Update auth.js to use database
4. Test the connection
5. Deploy to Render

**Time:** About 10 minutes!

