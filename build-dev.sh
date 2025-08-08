#!/bin/bash
set -e

echo "🏗️  Building Macro UI for Development..."

# Check for development environment file
if [ ! -f ".env" ]; then
    echo "❌ Development environment file (.env) not found!"
    echo "Please create it with your development API keys:"
    echo "  NOWPAYMENTS_API_KEY=your_development_api_key"
    echo "  NOWPAYMENTS_PUBLIC_KEY=your_development_public_key"
    exit 1
fi

# Load development environment variables
source .env

# Check if API keys are set
if [ -z "$NOWPAYMENTS_API_KEY" ] || [ -z "$NOWPAYMENTS_PUBLIC_KEY" ]; then
    echo "❌ Development API keys not found in .env!"
    echo "Please set NOWPAYMENTS_API_KEY and NOWPAYMENTS_PUBLIC_KEY"
    exit 1
fi

echo "✅ Development API keys loaded"

# Create temporary environment file with development keys
echo "📝 Creating development environment file..."
cat > src/environments/environment.dev.temp.ts << EOF
export const environment = {
  production: false,
  url: 'http://localhost:8089',
  baseUrl: 'http://localhost:8089/historical-data',
  seasonal: 'http://localhost:8089/seasonal-data',
  baseUrlAllDaily: 'http://localhost:8089/historical-data/daily/all',
  baseUrlYearAllDaily: 'http://localhost:8089/historical-data/year/allDys',
  baseUrlAlpha: 'http://localhost:8089/alpha/historical-data',
  baseUrlDynamicData: 'http://localhost:8089/alpha/historical-data/dynamic/economic',
  // NowPayments API Keys - Development keys
  nowpaymentsApiKey: '$NOWPAYMENTS_API_KEY',
  nowpaymentsPublicKey: '$NOWPAYMENTS_PUBLIC_KEY'
};
EOF

# Replace the development environment file
mv src/environments/environment.dev.temp.ts src/environments/environment.ts

echo "🔨 Building Angular application..."
npm run build

echo "✅ Development build completed!"
echo "📁 Build output: dist/my-app/browser"

# Clean up - restore original development environment file
echo "🧹 Cleaning up..."
git checkout src/environments/environment.ts

echo "🎉 Development build ready!" 