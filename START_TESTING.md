# 🚀 AiLiveChallenge - Easy Testing Guide

## 📱 Quick Access URL

### For Local Network (Same WiFi):
```
http://192.168.0.109:3000
```

**Share this URL with anyone on your WiFi network!**

---

## 🌐 Public Access (Any Network)

### Option 1: Using ngrok (Fastest Setup)

1. **Download ngrok:**
   - Visit: https://ngrok.com/download
   - Download Linux version
   - Extract: `unzip ngrok.zip`

2. **Start ngrok:**
   ```bash
   cd /path/to/ngrok
   ./ngrok http 3000
   ```

3. **Copy the URL** shown (e.g., `https://abc123.ngrok.io`)

4. **Share with testers anywhere in the world!**

### Option 2: Using serveo (No Installation)

```bash
# SSH tunnel - works without installation
ssh -R 80:localhost:3000 serveo.net
```

Share the URL provided!

---

## 🚀 Quick Start for Testing

### Start Everything:

```bash
cd /home/lenovo/AiLiveChallenge
bash start_all.sh
```

### Check Status:

```bash
# Check if running
curl http://localhost:3000
curl http://localhost:4000/health
```

---

## 📝 Share with Testers

### Simple Instruction Sheet:

**Copy and send this to testers:**

```
🎮 AiLiveChallenge Testing

ACCESS URL: [YOUR URL HERE]

Features to Test:
✅ User Registration
✅ Login/Logout
✅ Generate Challenges (Music, Logic, Trivia, etc.)
✅ Study Zone Quizzes (History, Science, Geography)
✅ Auto-advance on correct answers
✅ Retry on wrong answers
✅ User Profile & Stats
✅ Leaderboards
✅ Achievements

Test Accounts:
- Email: test@example.com
- Password: test123
```

---

## 🔧 Easy Public Access Setup

### Method 1: ngrok (Recommended)

```bash
# 1. Download ngrok
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar -xzf ngrok-v3-stable-linux-amd64.tgz

# 2. Start ngrok
./ngrok http 3000

# 3. Share the "Forwarding" URL
```

### Method 2: LocalTunnel

```bash
npm install -g localtunnel
lt --port 3000
```

### Method 3: Cloudflare Tunnel (Free)

```bash
cloudflared tunnel --url http://localhost:3000
```

---

## 🌍 Production Deployment Options

### Option A: Vercel (Recommended)
- Free hosting
- Automatic HTTPS
- Global CDN

### Option B: Railway
- Easy setup
- Database included
- Auto-deploy from GitHub

### Option C: Render
- Free tier available
- Easy deployment
- MongoDB support

---

## 🎯 Current Testing Setup

**Status: ✅ READY**

- Backend: http://192.168.0.109:4000
- Frontend: http://192.168.0.109:3000
- Database: MongoDB Atlas (Cloud)

**Next Step: Set up public access for remote testing**

See "Public Access" section above for quick setup!

