#!/bin/bash

# 🌐 Setup Public Access for Testing
# Makes the app accessible from anywhere

echo "🌐 Setting up public access for testing..."
echo ""

# Check if ngrok is installed
if command -v ngrok &> /dev/null; then
    echo "✅ ngrok found!"
    echo "Starting ngrok tunnel..."
    ngrok http 3000
else
    echo "⚠️  ngrok not installed"
    echo ""
    echo "📥 To install ngrok:"
    echo "   1. Visit: https://ngrok.com/download"
    echo "   2. Download Linux version"
    echo "   3. Extract and run: ./ngrok http 3000"
    echo ""
    echo "🔧 Or use localtunnel (easier):"
    echo "   npm install -g localtunnel"
    echo "   lt --port 3000"
    echo ""
fi

