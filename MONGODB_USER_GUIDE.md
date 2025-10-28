# MongoDB Atlas - Create Database User (Step by Step)

## Part 1: Log in to MongoDB Atlas

1. **Go to:** https://cloud.mongodb.com
2. **Click "Sign In"** (top right)
3. **Log in** with your MongoDB account (usually Google/Microsoft email)

---

## Part 2: Select Your Project

1. You'll see a list of projects (or "Create Project" if you have none)
2. **Click on your project** (likely named "MongoDB-Admin" or similar)
3. You should now see your project dashboard

---

## Part 3: Navigate to Database Access

1. On the left sidebar, look for:
   - **"Security"** (click to expand it)
   - Under Security, click **"Database Access"**
   
   OR

2. Look for a top menu bar with tabs like:
   - Overview | Deployments | Security | ...
   - Click **"Security"**
   - Then click **"Database Access"** (first option)

---

## Part 4: Create a New Database User

1. Click the green button: **"+ ADD NEW DATABASE USER"** (or "Add Database User")
2. Select authentication method:
   - Choose **"Password"** (not Certificate)
   
3. Fill in the form:
   - **Username:** `mindmix_user` (or any name you want)
   - **Password:** Click "Autogenerate Secure Password" or create your own
   - **IMPORTANT:** Save the password! Write it down immediately!
   
4. **Database User Privileges:**
   - Select: **"Atlas admin"** (or "Read and write to any database")
   - This gives the app permission to create and modify data
   
5. Click **"Add User"** button at the bottom

---

## Part 5: Get Your Connection String

### Step 1: Go to Database Deployments
1. In the left sidebar, under "Deployments":
   - Click **"Database"** (the first option)
   
2. You should see your cluster (usually named "Cluster0")

### Step 2: Get Connection String
1. Click the **"Connect"** button (next to your cluster)
2. A popup appears with options:
   - **"Drivers"** ← Click this
3. You'll see connection string examples
4. Click **"COPY"** next to the connection string

The connection string looks like:
```
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 3: Replace Placeholders
1. **Copy the connection string**
2. **Replace these parts:**
   - `<username>` → Your database username (e.g., `mindmix_user`)
   - `<password>` → Your database password (encode special characters if needed)

**Example:**
```
mongodb+srv://mindmix_user:MyP@ssw0rd123@cluster0.xxxxx.mongodb.net/mindmix?retryWrites=true&w=majority
```

**Important:** Encode special characters in password!
- `@` becomes `%40`
- `:` becomes `%3A`
- `/` becomes `%2F`
- `#` becomes `%23`
- etc.

---

## Part 6: Add to Render Environment Variables

1. **Go to:** https://dashboard.render.com
2. **Click on:** "mindmix-backend" (your backend service)
3. Click **"Environment"** tab (in the menu)
4. Scroll to find **"MONGO_URI"**
5. Click **"Edit"** or the **pencil icon** ✏️ next to it
6. **Paste your connection string:**
   ```
   mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mindmix?retryWrites=true&w=majority
   ```
7. **Make sure to:**
   - Replace `YOUR_USERNAME` with actual username
   - Replace `YOUR_PASSWORD` with actual password
   - Encode special characters if needed
8. Click **"Save Changes"**

---

## Part 7: Wait for Deployment

1. Render will automatically redeploy (you'll see a message)
2. Wait 2-3 minutes
3. Go to **"Logs"** tab
4. Look for: **"✅ MongoDB Connected"** 

---

## Troubleshooting

### If you see "bad auth : authentication failed":

**Problem:** Password has special characters not encoded

**Solution:** Encode these characters in the password:
```
: → %3A
/ → %2F
@ → %40
# → %23
% → %25
& → %26
= → %3D
? → %3F
```

**Example:**
```
Original password: MyP@ssw0rd#123
Encoded password: MyP%40ssw0rd%23123
```

**Quick fix tool:** https://www.urlencoder.org/

---

### If you see "authentication failed" even with correct password:

1. **Go back to MongoDB Atlas**
2. **Database Access** → find your user
3. **Edit the user** → regenerate password
4. **Copy the new password**
5. **Update Render** with new connection string
6. **Save and redeploy**

---

## Need Help?

Tell me:
1. What step are you stuck on?
2. What error message do you see?
3. Can you see your MongoDB cluster?

I'll help you get unstuck!

