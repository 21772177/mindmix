#!/bin/bash

# 🌐 Create Fresh Public Tunnel
# This generates a NEW public URL

echo "🌐 Creating new public tunnel..."
echo ""

# Kill old tunnels
pkill -f "serveo.net" 2>/dev/null

# Wait a moment
sleep 2

# Create new tunnel for frontend
echo "📱 Starting NEW serveo tunnel for frontend..."
echo ""
echo "Run this command in your terminal:"
echo ""
echo "ssh -R 80:localhost:3000 serveo.net"
echo ""
echo "This will show you a NEW URL"
echo ""
echo "THEN: Share that NEW URL with everyone!"

