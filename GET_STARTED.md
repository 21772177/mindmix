# 🚀 Get Started - AiLiveChallenge

## ✅ What's Done
1. ✅ Node.js v18.20.8 installed
2. ✅ npm installed  
3. ✅ Backend dependencies installed
4. ✅ Frontend dependencies installed
5. ✅ Environment configured with JWT secret

## ⏳ What You Need to Do

### 1. Get MongoDB (Choose One)

**Option A: MongoDB Atlas (Recommended - 5 minutes)**
```bash
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for FREE account
3. Create a cluster (choose FREE tier M0)
4. Get connection string
5. Update backend/.env with your connection string
```

**Option B: Install MongoDB Locally**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
sudo service mongod start

# Already configured in .env
```

### 2. Get OpenAI API Key
```bash
1. Go to: https://platform.openai.com/api-keys
2. Create new API key
3. Copy the key
4. Edit backend/.env
5. Replace: OPENAI_API_KEY=your-openai-api-key-here
```

### 3. Update backend/.env

Open `/home/lenovo/AiLiveChallenge/backend/.env` and update:

```env
# After getting MongoDB Atlas connection string:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ailivechallenge

# After getting OpenAI key:
OPENAI_API_KEY=sk-your-actual-key-here
```

## 🎯 Start the Application

Once MongoDB Atlas and OpenAI are configured:

```bash
cd /home/lenovo/AiLiveChallenge

# Make script executable
chmod +x start_all.sh

# Start everything
./start_all.sh
```

Or manually:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Signaling
cd backend && npm run signaling  

# Terminal 3 - Frontend
cd frontend-web && npm start
```

## 🌐 Access the App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

## 📝 Test It Out

1. Go to http://localhost:3000
2. Click "Register"
3. Enter your details
4. Click "Generate Challenge"
5. Select type and difficulty
6. Answer the challenge!

## 📚 Documentation

- **Setup Details**: [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)
- **Full Guide**: [SETUP_GUIDE.md](SETUP_GUIDE.md)  
- **API Docs**: [README.md](README.md)
- **Project Info**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

## Current Status

| Task | Status |
|------|--------|
| Dependencies Installed | ✅ Done |
| Environment Configured | ✅ Done |
| JWT Secret Generated | ✅ Done |
| MongoDB Atlas Setup | ⏳ Need Your Atlas Connection String |
| OpenAI Key | ⏳ Need Your API Key |
| Start App | ⏳ Waiting for Above |

## Need Help?

**MongoDB Atlas Help**: See [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)

**OpenAI Help**: 
- Get key: https://platform.openai.com/api-keys
- Add credits: https://platform.openai.com/account/billing

**Troubleshooting**:
- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for common issues
- Verify .env file has correct values
- Make sure MongoDB/Atlas is running
