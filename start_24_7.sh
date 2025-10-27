#!/bin/bash
echo "🚀 Starting MindMix+ for 24/7 Access..."
echo ""

# Start backend
echo "📦 Starting backend on port 4000..."
cd backend
npm start > /tmp/backend_24-7.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend on port 3000..."
cd frontend-web
API_URL=http://localhost:4000 BROWSER=none npm start > /tmp/frontend_24-7.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

# Start tunnels
echo ""
echo "🌐 Starting tunnels..."
npx localtunnel --port 4000 --subdomain mindmix-backend > /tmp/backend_tunnel.log 2>&1 &
BACKEND_TUNNEL_PID=$!

sleep 2

npx localtunnel --port 3000 --subdomain mindmix-app > /tmp/frontend_tunnel.log 2>&1 &
FRONTEND_TUNNEL_PID=$!

sleep 5

echo ""
echo "✅ Setup complete!"
echo ""
echo "📱 Your URLs:"
echo "   Frontend: https://mindmix-app.loca.lt"
echo "   Backend: https://mindmix-backend.loca.lt"
echo ""
echo "💡 These URLs work from ANY device!"
echo ""
echo "📋 To check status:"
echo "   tail -f /tmp/backend_24-7.log"
echo "   tail -f /tmp/frontend_24-7.log"
echo ""
echo "🔪 To stop (Ctrl+C or run): killall node npx"
