# 🚀 Setup Guide - AiLiveChallenge

This guide will help you get AiLiveChallenge running on your machine.

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend-web
npm install
```

## Step 2: MongoDB Setup

### Option A: Local MongoDB
Install and start MongoDB on your system:
```bash
# Linux
sudo service mongod start

# Mac
brew services start mongodb-community

# Windows: Start MongoDB service from Services panel
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Use it in the MONGO_URI environment variable

## Step 3: Configure Environment

Create `backend/.env` file:
```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ailivechallenge
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=30d
OPENAI_API_KEY=your-openai-api-key-here

# Optional: Self-hosted TURN server
COTURN_HOST=your-turn-server.com
COTURN_PORT=3478
COTURN_USER=turnuser
COTURN_PASS=turnpass
COTURN_REALM=example.com
```

### Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it to your `.env` file

## Step 4: Start the Application

### Quick Start (All Services)
```bash
chmod +x start_all.sh
./start_all.sh
```

### Manual Start (3 Terminals)
```bash
# Terminal 1 - Backend API
cd backend && npm run dev

# Terminal 2 - Signaling Server  
cd backend && npm run signaling

# Terminal 3 - Frontend
cd frontend-web && npm start
```

## Step 5: Access the App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/health

## Step 6: Test the Application

1. Open http://localhost:3000
2. Click "Register" and create an account
3. Click "Generate Challenge"
4. Answer the challenge!

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your MONGO_URI in `.env`
- Try: `mongosh` to test connection

### OpenAI API Error
- Verify your API key is correct
- Check your OpenAI account has credits
- API key format: `sk-...`

### Port Already in Use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Frontend Not Loading
- Run `npm install` in `frontend-web`
- Check that backend is running first
- Clear browser cache

## Optional: Self-Hosted TURN Server

For WebRTC features to work behind NATs:

```bash
cd backend/scripts
sudo bash turn_setup.sh
```

Then update your `.env` with the TURN credentials.

## Next Steps

- Read the full [README.md](README.md)
- Check out [tests/README.md](tests/README.md) for API examples
- Customize challenges in `ai_engine/prompts.js`

---

**Need Help?** Check the main README or open an issue!
