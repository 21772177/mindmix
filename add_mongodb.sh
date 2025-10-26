#!/bin/bash
# Helper script to add MongoDB connection string

echo "🍃 MongoDB Atlas Connection Setup"
echo "=================================="
echo ""
echo "I'll help you add your MongoDB connection string to the .env file."
echo ""
echo "What you should have:"
echo "  - Connection string from MongoDB Atlas"
echo "  - Format: mongodb+srv://username:password@cluster.mongodb.net"
echo ""
read -p "Paste your MongoDB connection string here: " MONGO_URI

if [ -z "$MONGO_URI" ]; then
    echo "❌ No connection string provided"
    exit 1
fi

# Update .env file
sed -i "s|MONGO_URI=.*|MONGO_URI=$MONGO_URI|" /home/lenovo/AiLiveChallenge/backend/.env

echo ""
echo "✅ MongoDB URI updated in backend/.env"
echo ""
echo "The server will automatically restart (nodemon)"
echo ""
echo "🧪 Testing connection in 3 seconds..."
sleep 3
curl -s http://localhost:4000/health | python3 -m json.tool
echo ""
echo ""
echo "📊 Check server logs above to see:"
echo "  ✅ 'MongoDB Connected: ...' (success)"
echo "  ⚠️  If errors, check your connection string and try again"
echo ""
echo "🎉 Next: Test registration!"
echo 'curl -X POST http://localhost:4000/auth/register -H "Content-Type: application/json" -d '"'"'{"name":"Test","email":"test@test.com","password":"pass1234"}'"'"

