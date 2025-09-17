#!/bin/bash

# Macro UI Docker Build and Run Script

set -e

echo "🐳 Building Macro UI Docker container..."

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
    -p 3000:3000 \
    --restart unless-stopped \
    macro-ui:latest

echo "✅ Container started successfully!"
echo "🌐 Application is running at: http://localhost:3000"
echo "🌐 Ready for Cloudflare Tunnel"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker logs -f macro-ui-production"
echo "  Stop container: docker stop macro-ui-production"
echo "  Remove container: docker rm macro-ui-production"
echo "  Check health: docker ps" 