#!/bin/bash
# Project Emergence - Quick Health Check Script
# This script performs basic health checks on the Project Emergence system

echo "🧠 Project Emergence - Health Check"
echo "=================================="

# Check if Python is available
echo "✓ Checking Python installation..."
python3 --version > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  Python is available: $(python3 --version)"
else
    echo "  ❌ Python is not available"
    exit 1
fi

# Check if required directories exist
echo ""
echo "✓ Checking project structure..."
if [ -d "Web_Interface" ]; then
    echo "  Web_Interface directory exists"
else
    echo "  ❌ Web_Interface directory missing"
fi

if [ -d "Development" ]; then
    echo "  Development directory exists"
else
    echo "  ❌ Development directory missing"
fi

# Check if main files exist
echo ""
echo "✓ Checking core files..."
files=("serve.py" "README.md" "Web_Interface/index.html")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  $file exists"
    else
        echo "  ❌ $file missing"
    fi
done

# Test web server startup (dry run)
echo ""
echo "✓ Testing web server configuration..."
cd Web_Interface > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  Can navigate to Web_Interface directory"
    cd ..
else
    echo "  ❌ Cannot navigate to Web_Interface directory"
fi

# Check favicon
if [ -f "Web_Interface/favicon.svg" ]; then
    echo "  Custom favicon exists"
else
    echo "  ❌ Custom favicon missing"
fi

echo ""
echo "🎉 Health check completed!"
echo ""
echo "To start the development server:"
echo "  python serve.py"
echo ""
echo "To view in browser:"
echo "  Open http://localhost:8000 in your browser"
