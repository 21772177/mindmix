#!/bin/bash
echo "🚀 Starting MindMix+ with Render backend (NO TUNNEL!)..."

# Kill any existing processes
killall -9 node 2>/dev/null || true
sleep 2

# Start backend locally
echo "📦 Starting backend..."
cd /home/lenovo/AiLiveChallenge/backend && nohup npm start > /tmp/backend_local.log 2>&1 &
sleep 3

# Start frontend pointing to RENDER backend
echo "🎨 Starting frontend..."
cd /home/lenovo/AiLiveChallenge/frontend-web && nohup REACT_APP_API_URL=https://mindmix-iuzf.onrender.com npm start > /tmp/frontend_local.log 2>&1 &
sleep 5

echo ""
echo "✅ App started!"
echo ""
echo "📱 Access at: http://localhost:3000"
echo ""
echo "This uses Render backend (no tunnel needed!)"
echo "Works locally only - restart if you close terminal"
echo ""
echo "To check logs:"
echo "  tail -f /tmp/backend_local.log"
echo "  tail -f /tmp/frontend_local.log"

