#!/bin/bash
# Dutch Kicks — redeploy (run after each git push)
# Usage: ssh root@2.24.66.66 "bash /var/www/dutch-kicks/scripts/deploy.sh"

set -e

cd /var/www/dutch-kicks

echo "==> Pulling latest..."
git pull origin main

echo "==> Installing dependencies..."
npm ci

echo "==> Building..."
npm run build

echo "==> Restarting..."
pm2 restart dutch-kicks

echo "==> Done."
pm2 status dutch-kicks
