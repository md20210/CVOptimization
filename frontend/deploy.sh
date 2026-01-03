#!/bin/bash
# Deployment Script for CVOptimization to Strato SFTP
# Deploys to: dabrock.info/cv-optimization/

set -e

echo "======================================"
echo "  CVOptimization - Strato Deployment"
echo "======================================"
echo ""

# Configuration
SFTP_USER="su403214"
SFTP_HOST="5018735097.ssh.w2.strato.hosting"
SFTP_PASS="deutz16!2000"
REMOTE_PATH="/dabrock-info/cv-optimization"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Build
echo -e "${BLUE}[1/3]${NC} Building React app..."
npm run build

if [ ! -d "dist" ]; then
  echo -e "${YELLOW}Error: dist/ directory not found!${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Build completed${NC}"
echo ""

# Step 2: Prepare SFTP batch file
echo -e "${BLUE}[2/3]${NC} Preparing SFTP upload..."

cat > /tmp/sftp-batch.txt << EOF
cd $REMOTE_PATH
put -r dist/*
bye
EOF

echo -e "${GREEN}✓ SFTP batch file created${NC}"
echo ""

# Step 3: Upload via SFTP
echo -e "${BLUE}[3/3]${NC} Uploading to Strato..."

sshpass -p "$SFTP_PASS" sftp -o StrictHostKeyChecking=no -b /tmp/sftp-batch.txt "$SFTP_USER@$SFTP_HOST"

# Cleanup
rm /tmp/sftp-batch.txt

echo ""
echo -e "${GREEN}======================================"
echo -e "  ✓ Deployment Successful!"
echo -e "======================================${NC}"
echo ""
echo "🌐 Live URL: https://www.dabrock.info/cv-optimization/"
echo ""
echo "Next steps:"
echo "  1. Test the live site"
echo "  2. Verify n8n backend connection"
echo "  3. Test CV optimization flow"
echo ""
