#!/bin/bash

# Deployment script for 24/7 School Platform
echo "🚀 Starting deployment process..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful!"
    echo "📁 Build files created in 'dist' directory"
    
    # List important files
    echo "📋 Important files:"
    ls -la dist/
    
    echo ""
    echo "🌐 Ready for deployment!"
    echo "📤 You can now:"
    echo "   1. Drag and drop the 'dist' folder to Netlify"
    echo "   2. Or push to GitHub for automatic deployment"
    echo ""
    echo "🔗 After deployment, test these URLs:"
    echo "   - https://24-7-school.netlify.app/"
    echo "   - https://24-7-school.netlify.app/admin"
    echo "   - https://24-7-school.netlify.app/lessons/math"
else
    echo "❌ Build failed!"
    exit 1
fi

