# Use Node.js 18 Alpine as base image for smaller size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci --legacy-peer-deps

# Copy source code, excluding the .git directory
COPY . .

# Build the application
RUN npm run build

# Create production directory
RUN mkdir -p /app/production

# Copy built application to production directory
# Note: Changed from 'dist/my-app/browser/*' to 'dist/my-app/browser/'
# The asterisk can cause issues if the directory is empty.
RUN cp -r dist/my-app/browser/. /app/production/

# Copy server.js
RUN cp server.js /app/production/

# Set working directory to production
WORKDIR /app/production

# Expose HTTP port
EXPOSE 3000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app/production

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["node", "server.js"]
