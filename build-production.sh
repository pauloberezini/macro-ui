#!/bin/bash
set -e

echo "🏗️  Building Macro UI for Production..."

# Check for production environment file
if [ ! -f ".env.production" ]; then
    echo "❌ Production environment file (.env.production) not found!"
    echo "Please create it with your production API keys:"
    echo "  NOWPAYMENTS_API_KEY=your_production_api_key"
    echo "  NOWPAYMENTS_PUBLIC_KEY=your_production_public_key"
    exit 1
fi

# Load production environment variables
source .env.production

# Check if API keys are set
if [ -z "$NOWPAYMENTS_API_KEY" ] || [ -z "$NOWPAYMENTS_PUBLIC_KEY" ]; then
    echo "❌ Production API keys not found in .env.production!"
    echo "Please set NOWPAYMENTS_API_KEY and NOWPAYMENTS_PUBLIC_KEY"
    exit 1
fi

echo "✅ Production API keys loaded"

# Backup the original environment file before overwriting it.
if [ -f "src/environments/environment.prod.ts" ]; then
    echo "📝 Backing up original environment file..."
    cp src/environments/environment.prod.ts src/environments/environment.prod.ts.bak
fi

# Create temporary environment file with production keys
echo "📝 Creating temporary environment file..."
cat > src/environments/environment.prod.temp.ts << EOF
export const environment = {
  production: true,
  url: 'https://server.berezini.com',
  baseUrl: 'https://server.berezini.com/historical-data',
  seasonal: 'https://server.berezini.com/seasonal-data',
  baseUrlAllDaily: 'https://server.berezini.com/historical-data/daily/all',
  baseUrlYearAllDaily: 'https://server.berezini.com/historical-data/year/allDys',
  baseUrlAlpha: 'https://server.berezini.com/alpha/historical-data',
  baseUrlDynamicData: 'https://server.berezini.com/alpha/historical-data/dynamic/economic',
  // NowPayments API Keys - Production keys
  nowpaymentsApiKey: '$NOWPAYMENTS_API_KEY',
  nowpaymentsPublicKey: '$NOWPAYMENTS_PUBLIC_KEY'
};
EOF

# Replace the production environment file
mv src/environments/environment.prod.temp.ts src/environments/environment.prod.ts

echo "🔨 Building Angular application..."
npm run build

echo "✅ Production build completed!"
echo "📁 Build output: dist/my-app/browser"

# Cleanup - restore original production environment file
echo "🧹 Restoring original environment file..."
mv src/environments/environment.prod.ts.bak src/environments/environment.prod.ts

echo "🎉 Production build ready for deployment!"
