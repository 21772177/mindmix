#!/bin/bash

# 🌐 Complete Tunnel Setup - ONE URL for Frontend + Backend
# This creates a tunnel that works from ANY network

echo "🌐 Setting up complete public access..."
echo ""

# Kill old tunnels
pkill -f "localtunnel" 2>/dev/null
pkill -f "serveo" 2>/dev/null

echo "✅ Starting LocalTunnel for frontend (port 3000)..."
echo ""
echo "Your public URL will appear below:"
echo ""

# Start localtunnel (shows URL in output)
npx -y localtunnel --port 3000

echo ""
echo "✅ Copy the URL above to share with everyone!"
echo "✅ This ONE URL handles both frontend and backend!"

