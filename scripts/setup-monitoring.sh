#!/bin/bash

echo "🚀 Aingen Monitoring Setup"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install @upstash/redis

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Create environment file template
echo "🔧 Creating environment file template..."
cat > .env.monitoring.example << 'EOF'
# Project Aegis Monitoring Configuration
# Copy this file to .env.monitoring and fill in your actual values

# Vercel Configuration
VERCEL_TOKEN=your_vercel_token_here
VERCEL_PROJECT_ID=your_project_id_here
VERCEL_TEAM_ID=your_team_id_here

# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here

# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token_here

# Monitoring Configuration (optional)
VERCEL_CHECK_INTERVAL=300000  # 5 minutes
REDIS_CHECK_INTERVAL=120000   # 2 minutes
GITHUB_CHECK_INTERVAL=600000  # 10 minutes
EOF

echo "✅ Environment template created: .env.monitoring.example"

# Make monitoring script executable
echo "🔧 Making monitoring script executable..."
chmod +x scripts/monitor.js

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.monitoring.example to .env.monitoring"
echo "2. Fill in your actual API tokens and credentials"
echo "3. Run 'npm run monitor' to start monitoring"
echo "4. Access the monitoring dashboard in your app"
echo ""
echo "📚 See MONITORING.md for detailed instructions" 