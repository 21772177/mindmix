#!/bin/bash
echo "🚀 Starting MindMix+ (simple version)..."

# Stop old processes
killall -9 node 2>/dev/null || true
sleep 2

# Start backend
cd /home/lenovo/AiLiveChallenge/backend && nohup npm start > /tmp/backend_simple.log 2>&1 &
sleep 5

# Start frontend
cd /home/lenovo/AiLiveChallenge/frontend-web && nohup npm start > /tmp/frontend_simple.log 2>&1 &
sleep 3

echo ""
echo "✅ Starting... wait 30 seconds"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "Backend uses: http://localhost:4000"
echo ""
echo "Check logs with:"
echo "  tail -f /tmp/frontend_simple.log"

