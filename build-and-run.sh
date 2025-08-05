#!/bin/bash

# Macro UI Docker Build and Run Script

set -e

echo "🐳 Building Macro UI Docker container..."

# Check for SSL certificates
if [ ! -f "cert/your_private.key" ] || [ ! -f "cert/your_certificate.crt" ]; then
    echo "❌ SSL certificates not found!"
    echo "Please ensure you have the following files in the 'cert' directory:"
    echo "  - your_private.key"
    echo "  - your_certificate.crt"
    exit 1
fi
echo "✅ SSL certificates found"

# Check for production environment file
if [ ! -f ".env.production" ]; then
    echo "⚠️  Production environment file (.env.production) not found!"
    echo "Creating from template..."
    cp env.production.template .env.production
    echo "📝 Please edit .env.production with your actual production API keys"
    echo "   - NOWPAYMENTS_API_KEY"
    echo "   - NOWPAYMENTS_PUBLIC_KEY"
    exit 1
fi
echo "✅ Production environment file found"

echo "🔨 Building Docker image..."
docker build -t macro-ui:latest .

echo "✅ Docker image built successfully!"

# Stop and remove existing container
if [ "$(docker ps -aq -f name=macro-ui-production)" ]; then
    echo "🛑 Stopping existing container..."
    docker stop macro-ui-production
    docker rm macro-ui-production
fi

echo "🚀 Starting container..."
docker run -d \
    --name macro-ui-production \
    -p 443:443 \
    --env-file .env.production \
    -v $(pwd)/cert:/app/production/cert:ro \
    --restart unless-stopped \
    macro-ui:latest

echo "✅ Container started successfully!"
echo "🌐 Application is running at: https://localhost:443"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker logs -f macro-ui-production"
echo "  Stop container: docker stop macro-ui-production"
echo "  Remove container: docker rm macro-ui-production"
echo "  Check health: docker ps" 