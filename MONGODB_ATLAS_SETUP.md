# 🍃 MongoDB Atlas Setup (Easiest Option)

## Why MongoDB Atlas?
- ✅ **Free** (512MB storage)
- ✅ **No installation** needed
- ✅ **Cloud-hosted** - always available
- ✅ **Automatic backups**
- ✅ **Ready in 5 minutes**

## Step-by-Step Setup

### 1. Create Free Account
Go to: https://www.mongodb.com/cloud/atlas/register

### 2. Create a Cluster
- Choose **FREE** tier (M0 Sandbox)
- Choose **AWS** or **Google Cloud**
- Choose closest region
- Click **"Create Cluster"**

### 3. Set Up Security
- **Username**: `ailivechallenge` (or any username)
- **Password**: Create a strong password (save it!)
- Click **"Create Database User"**

### 4. Network Access
- Click **"Add My Current IP Address"**
- Or click **"Allow Access from Anywhere"** (for development)
- Click **"Finish and Close"**

### 5. Get Connection String
- Click **"Connect"** button
- Choose **"Connect your application"**
- Copy the connection string
- It looks like: `mongodb+srv://username:password@cluster.mongodb.net/`

### 6. Update Your App
Replace `<password>` in the connection string with your actual password.

Example:
```
mongodb+srv://ailivechallenge:myPassword123@cluster0.xxxxx.mongodb.net/ailivechallenge
```

## Quick Test
Try this from your terminal:
```bash
curl "https://data.mongodb-api.com/app/data-test/endpoint/data/v1"
```

## Ready?
Once you have the connection string, we'll add it to your `.env` file!

---

**Need Help?** Visit: https://www.mongodb.com/docs/atlas/getting-started/
