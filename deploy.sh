#!/bin/bash
set -e

# Configuration
APP_NAME="adi-track"
PORT=3000

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Warning: .env file not found. Creating an empty one.${NC}"
    touch .env
fi

# Build the Docker image
echo -e "${GREEN}Building Docker image...${NC}"
docker build -t $APP_NAME:latest .

# Create or update the container
echo -e "${GREEN}Deploying container...${NC}"
if docker ps -a | grep -q $APP_NAME; then
    echo -e "${YELLOW}Stopping and removing existing container...${NC}"
    docker stop $APP_NAME || true
    docker rm $APP_NAME || true
fi

echo -e "${GREEN}Creating new container...${NC}"
docker run -d \
    --name $APP_NAME \
    --restart unless-stopped \
    -p $PORT:3000 \
    --env-file .env \
    $APP_NAME:latest

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Deployment successful!${NC}"
    echo -e "${GREEN}Application is running at http://localhost:$PORT${NC}"
else
    echo -e "${RED}Deployment failed!${NC}"
    exit 1
fi

echo -e "${GREEN}Deployment process completed!${NC}"
