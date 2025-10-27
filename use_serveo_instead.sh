#!/bin/bash
echo "🚀 Starting with Serveo (NO PASSWORD NEEDED)..."

# Stop current tunnels
killall -9 node 2>/dev/null || true
sleep 2

# Start backend
echo "📦 Starting backend on port 4000..."
cd /home/lenovo/AiLiveChallenge/backend && nohup npm start > /tmp/backend_serveo.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Start frontend
echo "🎨 Starting frontend on port 3000..."
cd /home/lenovo/AiLiveChallenge/frontend-web && nohup API_URL=http://localhost:4000 BROWSER=none npm start > /tmp/frontend_serveo.log 2>&1 &
FRONTEND_PID=$!
sleep 5

echo ""
echo "✅ Apps started!"
echo ""
echo "📱 NOW RUN THESE IN TERMINAL:"
echo ""
echo "Backend tunnel (copy & paste):"
echo "  ssh -R 80:localhost:4000 serveo.net"
echo ""
echo "In NEW terminal, frontend tunnel:"
echo "  ssh -R 80:localhost:3000 serveo.net"
echo ""
echo "✅ NO PASSWORD NEEDED!"
echo "✅ URLs will be shown when you run ssh commands"

EOF

chmod +x use_serveo_instead.sh

