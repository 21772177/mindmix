#!/bin/bash

# Push to GitHub helper script

echo ""
echo "🚀 Pushing MindMix+ to GitHub..."
echo ""

# Get the token
echo "Enter your GitHub Personal Access Token:"
read -s TOKEN

if [ -z "$TOKEN" ]; then
  echo "❌ No token provided"
  exit 1
fi

# Update remote with token
git remote set-url origin https://${TOKEN}@github.com/21772177/mindmix.git

# Push to GitHub
git push -u origin main

echo ""
echo "✅ Done! Check https://github.com/21772177/mindmix"

