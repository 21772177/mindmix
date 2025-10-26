#!/bin/bash

echo ""
echo "🌐 MindMix+ - Get Your Testing URL"
echo "==================================="
echo ""
echo "Starting fresh tunnel..."
echo ""

# Kill old tunnels
pkill -f "localtunnel" 2>/dev/null
pkill -f "ssh -R.*serveo" 2>/dev/null

sleep 2

echo "Creating new public URL..."
echo "This will show you a URL you can use anywhere!"
echo ""

# Use serveo (no password, more reliable)
ssh -R 80:localhost:3000 serveo.net

