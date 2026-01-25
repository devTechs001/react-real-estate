#!/bin/bash

# Script to install missing dependencies for the real estate server

echo "Installing missing dependencies..."

# Change to the server directory
cd /home/darkhat/projects/react-projects/real-estate/react-real-estate/server

# Install stripe package
echo "Installing stripe..."
pnpm add stripe

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "Stripe installed successfully!"
else
    echo "Failed to install stripe. Trying with npm..."
    npm install stripe
fi

echo "Dependency installation complete."
echo ""
echo "To run the server with full functionality:"
echo "1. Make sure MongoDB is running locally ('mongod' in a separate terminal)"
echo "2. Run 'cd server && pnpm run dev' or 'node --env-file=.env server.js'"