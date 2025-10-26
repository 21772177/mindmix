#!/bin/bash
# Start backend, signaling, and frontend concurrently (for dev). Ensure you ran npm install in backend and frontend-web.

echo "🚀 Starting AiLiveChallenge Services..."
echo ""

# Start backend
echo "📦 Starting Backend Server..."
(cd backend && npm run dev) &
BACKEND_PID=$!
sleep 2

# Start signaling server
echo "🎮 Starting Signaling Server..."
(cd backend && npm run signaling) &
SIGNALING_PID=$!
sleep 2

# Start frontend
echo "🎨 Starting Frontend..."
(cd frontend-web && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "✅ All services started!"
echo ""
echo "📍 Services running on:"
echo "   Backend API: http://localhost:4000"
echo "   Signaling: ws://localhost:4001"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for user interrupt
wait
