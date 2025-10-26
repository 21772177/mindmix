# ⚡ Quick Start Guide

Get AiLiveChallenge running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js installed (v16 or higher)
- [ ] MongoDB installed or Atlas account
- [ ] OpenAI API key
- [ ] Terminal/Command prompt

## Step-by-Step

### 1️⃣ Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend-web
npm install
```

### 2️⃣ Configure Environment

```bash
cd backend
cp env.example .env
```

Edit `.env` file:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/ailivechallenge
JWT_SECRET=change-this-to-a-random-32-character-string
OPENAI_API_KEY=sk-your-actual-openai-key
```

### 3️⃣ Start MongoDB

**Local:**
```bash
# Linux
sudo service mongod start

# Mac  
brew services start mongodb-community
```

**Or use Atlas:**
- Go to https://mongodb.com/atlas
- Create free cluster
- Get connection string
- Replace MONGO_URI in .env

### 4️⃣ Start the Application

```bash
# Make script executable
chmod +x start_all.sh

# Start everything
./start_all.sh
```

### 5️⃣ Access the App

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

## Troubleshooting

### "Cannot find module"
```bash
npm install
```

### "Port already in use"
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### "MongoDB connection failed"
- Check if MongoDB is running: `mongosh`
- Verify MONGO_URI in `.env`
- Try MongoDB Atlas (cloud) instead

### "OpenAI API error"
- Check your API key in `.env`
- Verify account has credits
- Check billing at https://platform.openai.com

## First Time Usage

1. Go to http://localhost:3000
2. Click "Register"
3. Enter: Name, Email, Password
4. Click "Generate Challenge"
5. Select type and difficulty
6. Answer the challenge!

## Need Help?

- See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
- See [README.md](README.md) for full documentation
- API examples in [tests/README.md](tests/README.md)

---

**That's it! You should be running in under 5 minutes.**
