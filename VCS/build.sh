#!/bin/bash

echo "Building BergDotBet Admin Panel for Vercel..."

# Build frontend
npm run build

# Copy shared schema to dist
mkdir -p dist/shared
cp -r shared/* dist/shared/

echo "Build completed successfully!"