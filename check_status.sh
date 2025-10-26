#!/bin/bash

echo "🔍 AiLiveChallenge Status Check"
echo "=================================="
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js: Not installed"
fi

# Check npm
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm: Not installed"
fi

# Check dependencies
echo ""
echo "📦 Dependencies:"
if [ -d "backend/node_modules" ]; then
    echo "✅ Backend: Installed"
else
    echo "❌ Backend: Not installed (run: cd backend && npm install)"
fi

if [ -d "frontend-web/node_modules" ]; then
    echo "✅ Frontend: Installed"
else
    echo "❌ Frontend: Not installed (run: cd frontend-web && npm install)"
fi

# Check .env
echo ""
echo "⚙️  Configuration:"
if [ -f "backend/.env" ]; then
    echo "✅ .env file exists"
    
    # Check JWT secret
    if grep -q "JWT_SECRET=your-super-secret" backend/.env; then
        echo "⚠️  JWT_SECRET: Not updated"
    else
        echo "✅ JWT_SECRET: Configured"
    fi
    
    # Check OpenAI key
    if grep -q "OPENAI_API_KEY=your-openai-api-key-here" backend/.env; then
        echo "⚠️  OPENAI_API_KEY: Not configured"
    else
        echo "✅ OPENAI_API_KEY: Set"
    fi
    
    # Check MongoDB URI
    if grep -q "localhost:27017" backend/.env; then
        echo "⚠️  MONGO_URI: Using localhost (install MongoDB or use Atlas)"
    else
        echo "✅ MONGO_URI: Configured"
    fi
else
    echo "❌ .env file: Not found"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Get MongoDB Atlas connection string"
echo "2. Get OpenAI API key"
echo "3. Update backend/.env with credentials"
echo "4. Run: ./start_all.sh"
echo ""
echo "📚 Documentation:"
echo "- GET_STARTED.md - Quick start guide"
echo "- MONGODB_ATLAS_SETUP.md - MongoDB setup"
echo "- SETUP_GUIDE.md - Detailed setup"
