#!/bin/bash

# Script to retrieve deleted files from Git history
# Run this to restore any deleted files if needed

echo "📦 MindMix+ - Retrieve Deleted Files"
echo "===================================="
echo ""
echo "This script helps you restore deleted files from Git history."
echo ""

# Show commits where files were deleted
echo "📋 Commits with deleted files:"
echo ""
git log --oneline --diff-filter=D -n 5
echo ""

# List deleted files in the cleanup commit
echo "🗑️  Files deleted in cleanup:"
echo ""
git diff --name-only --diff-filter=D b5fb068~1 b5fb068
echo ""

# Option to restore all or specific files
echo "💡 To restore specific files:"
echo "   git checkout b5fb068~1 -- <filename>"
echo ""
echo "💡 To view a deleted file:"
echo "   git show b5fb068~1:<filename>"
echo ""

# Create a detailed list
echo "Creating detailed list of deleted files..."
git show --name-status --diff-filter=D b5fb068 | grep "^D" > ARCHIVE/deleted_files_list.txt
echo "✅ List saved to: ARCHIVE/deleted_files_list.txt"
echo ""

# Count files
total=$(git diff --name-only --diff-filter=D b5fb068~1 b5fb068 | wc -l)
echo "📊 Total files deleted: $total"
echo ""
echo "✅ All deleted files are accessible in Git history"

