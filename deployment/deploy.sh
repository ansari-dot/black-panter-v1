#!/bin/bash

# ============================================
# VPS Deployment Script
# ============================================
# This script deploys the full stack application to a VPS
# Usage: ./deploy.sh
# ============================================

set -e

# Configuration
DOMAIN="yourdomain.com"
ADMIN_DOMAIN="admin.yourdomain.com"
API_DOMAIN="api.yourdomain.com"
DEPLOY_DIR="/var/www"
PROJECT_NAME="blackpanther"

echo "=========================================="
echo "Starting VPS Deployment"
echo "=========================================="

# 1. Update system packages
echo "Step 1: Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install required packages
echo "Step 2: Installing required packages..."
sudo apt install -y nginx nodejs npm git curl ufw

# 3. Install PM2 globally
echo "Step 3: Installing PM2..."
sudo npm install -g pm2

# 4. Setup firewall
echo "Step 4: Setting up firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 5. Create project directories
echo "Step 5: Creating project directories..."
sudo mkdir -p $DEPLOY_DIR/client
sudo mkdir -p $DEPLOY_DIR/server
sudo mkdir -p $DEPLOY_DIR/admin
sudo mkdir -p $DEPLOY_DIR/server/uploads
sudo mkdir -p /var/log/pm2

# 6. Set permissions
echo "Step 6: Setting permissions..."
sudo chown -R $USER:$USER $DEPLOY_DIR
sudo chown -R $USER:$USER /var/log/pm2

# 7. Copy project files (adjust paths as needed)
echo "Step 7: Copying project files..."
# Assuming you're running this from the project root
cp -r client/* $DEPLOY_DIR/client/
cp -r server/* $DEPLOY_DIR/server/
cp -r admin/* $DEPLOY_DIR/admin/

# 8. Install dependencies and build
echo "Step 8: Installing dependencies and building..."

# Build client
cd $DEPLOY_DIR/client
npm install
npm run build

# Build admin
cd $DEPLOY_DIR/admin
npm install
npm run build

# Install server dependencies
cd $DEPLOY_DIR/server
npm install

# 9. Setup environment files
echo "Step 9: Setting up environment files..."
# You need to manually create .env files with your production values
echo "⚠️  IMPORTANT: Create .env files in client/, admin/, and server/ with production values"

# 10. Setup Nginx configurations
echo "Step 10: Setting up Nginx configurations..."
sudo cp deployment/nginx-client.conf /etc/nginx/sites-available/$DOMAIN
sudo cp deployment/nginx-api.conf /etc/nginx/sites-available/$API_DOMAIN
sudo cp deployment/nginx-admin.conf /etc/nginx/sites-available/$ADMIN_DOMAIN

# Enable sites
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/$API_DOMAIN /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/$ADMIN_DOMAIN /etc/nginx/sites-enabled/

# Remove default nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# 11. Setup SSL with Let's Encrypt
echo "Step 11: Setting up SSL with Let's Encrypt..."
sudo apt install -y certbot python3-certbot-nginx
echo "⚠️  IMPORTANT: Run 'sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN -d $API_DOMAIN -d $ADMIN_DOMAIN' manually"

# 12. Start backend with PM2
echo "Step 12: Starting backend with PM2..."
cd $DEPLOY_DIR
pm2 start deployment/ecosystem.config.js
pm2 save
pm2 startup

# 13. Restart Nginx
echo "Step 13: Restarting Nginx..."
sudo systemctl restart nginx

echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo "Next steps:"
echo "1. Create .env files with production values"
echo "2. Run SSL certificate: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN -d $API_DOMAIN -d $ADMIN_DOMAIN"
echo "3. Update nginx configs with your actual domain names"
echo "4. Test your application"
echo "=========================================="
