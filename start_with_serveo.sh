#!/bin/bash
echo "🚀 Starting MindMix+ with Serveo (no password needed)..."

# Kill any existing processes
pkill -f "node.*3000" || true
pkill -f "node.*4000" || true

# Start backend
echo "📦 Starting backend..."
cd /home/lenovo/AiLiveChallenge/backend && nohup npm start > /tmp/backend.log 2>&1 &
sleep 3

# Start frontend  
echo "🎨 Starting frontend..."
cd /home/lenovo/AiLiveChallenge/frontend-web && nohup API_URL=http://localhost:4000 BROWSER=none npm start > /tmp/frontend.log 2>&1 &
sleep 5

echo ""
echo "✅ Apps started!"
echo ""
echo "📱 Now run these commands in DIFFERENT terminals:"
echo ""
echo "Terminal 1 (Backend tunnel):"
echo "  ssh -R mindmix-backend:4000:localhost:4000 serveo.net"
echo ""
echo "Terminal 2 (Frontend tunnel):"
echo "  ssh -R mindmix-app:3000:localhost:3000 serveo.net"
echo ""
echo "Then access: https://mindmix-app.serveo.net"
echo ""

