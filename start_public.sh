#!/bin/bash

# 🚀 Start AiLiveChallenge with Public Access
# Share this URL with anyone for testing!

echo "🚀 Starting AiLiveChallenge..."
echo ""

# Start backend
echo "📦 Starting backend..."
cd backend && node server.js > ../backend.log 2>&1 &
BACKEND_PID=$!
sleep 2

# Start frontend
echo "🎨 Starting frontend..."
cd ../frontend-web && npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5

echo ""
echo "✅ App is starting..."
echo ""
echo "📱 LOCAL ACCESS (Same WiFi):"
echo "   http://192.168.0.109:3000"
echo ""
echo "🌐 FOR PUBLIC ACCESS (Any Network):"
echo ""
echo "   Option A - LocalTunnel (Easiest):"
echo "   cd /home/lenovo/AiLiveChallenge"
echo "   npx localtunnel --port 3000"
echo ""
echo "   Option B - ngrok:"
echo "   Visit: https://ngrok.com/download"
echo "   Run: ./ngrok http 3000"
echo ""
echo "   Option C - SSH Tunnel:"
echo "   ssh -R 80:localhost:3000 serveo.net"
echo ""
echo "💡 Share the public URL you get with testers!"
echo ""

