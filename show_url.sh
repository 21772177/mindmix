#!/bin/bash

echo ""
echo "🧠 MindMix+ - Public URL"
echo "========================"
echo ""
echo "Your app is running on:"
echo ""

# Try to get serveo URL
if ps aux | grep -q "ssh -R.*serveo"; then
  echo "✅ Tunnel is running!"
  echo "📱 To get your URL, check the terminal where you ran:"
  echo "   ssh -R 80:localhost:3000 serveo.net"
  echo ""
  echo "OR create a new tunnel by running:"
  echo "   ./get_url.sh"
else
  echo "No tunnel running. Starting one..."
  ssh -R 80:localhost:3000 serveo.net
fi

echo ""
echo "Your local URL:"
echo "http://localhost:3000"
echo ""

