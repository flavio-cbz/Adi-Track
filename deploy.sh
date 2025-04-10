#!/bin/bash
set -e

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed."
    exit 1
fi

# Environment setup
ENV=${1:-production}
echo "Deploying in $ENV environment"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOL
NODE_ENV=${ENV}
PORT=3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
EOL
    echo ".env file created"
fi

# Build and start containers
echo "Building and starting containers..."
docker-compose build
docker-compose up -d

echo "Deployment completed!"
echo "Application is running at http://localhost:${PORT:-3000}"

# Show logs
echo "Showing logs (press Ctrl+C to exit):"
docker-compose logs -f