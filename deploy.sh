#!/bin/bash
set -e

echo "Starting deployment..."
echo "Installing npm dependencies..."
npm ci

echo "Dependency installation complete!"
echo "App deployment ready. Express server will start with 'npm start' command."
