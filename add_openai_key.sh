#!/bin/bash
# Helper script to add OpenAI API key

echo "🔑 Add OpenAI API Key"
echo "===================="
echo ""
read -p "Enter your OpenAI API key (starts with sk-): " API_KEY

if [ -z "$API_KEY" ]; then
    echo "❌ No key provided"
    exit 1
fi

# Update .env file
sed -i "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$API_KEY|" /home/lenovo/AiLiveChallenge/backend/.env

echo ""
echo "✅ Key updated in backend/.env"
echo ""
echo "The server will automatically reload (nodemon)"
echo ""
echo "🧪 Test it now with:"
echo 'curl "http://localhost:4000/ai/generate?type=music&difficulty=easy"'
