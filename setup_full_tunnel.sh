#!/bin/bash

# 🌐 Setup FULL Public Access (Frontend + Backend)
# This makes BOTH frontend and backend accessible from anywhere

echo "🌐 Setting up FULL public access..."
echo ""

# Start frontend tunnel (port 3000)
echo "📱 Frontend tunnel..."
ssh -fN -R 80:localhost:3000 serveo.net &
FRONTEND_PID=$!

# Start backend tunnel (port 4000)  
echo "📦 Backend tunnel..."
ssh -fN -R 81:localhost:4000 serveo.net &
BACKEND_PID=$!

sleep 3

echo ""
echo "✅ Tunnels created!"
echo ""
echo "Frontend tunnel PID: $FRONTEND_PID"
echo "Backend tunnel PID: $BACKEND_PID"
echo ""
echo "📋 Find your public URLs:"
echo "Run this to see tunnel info:"
echo "ssh -L 4444:serveo.net:22 serveo.net -N"
echo ""
echo "Or check: https://serveo.net"
echo ""
echo "💡 Tip: Use localtunnel instead - easier!"
echo "   npx localtunnel --port 3000"
echo "   npx localtunnel --port 4000"

