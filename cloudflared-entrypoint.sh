#!/bin/sh

if [ -n "$CLOUDFLARED_TOKEN" ]; then
  echo "Starting Cloudflare Tunnel with token..."
  cloudflared tunnel --no-autoupdate run --token "$CLOUDFLARED_TOKEN"
else
  echo "CLOUDFLARED_TOKEN not set. Starting quick tunnel for testing..."
  cloudflared tunnel --url http://macro-ui:3000
fi
