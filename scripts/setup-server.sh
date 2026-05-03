#!/bin/bash
# Dutch Kicks — first-time VPS setup
# Run as root on Ubuntu 24.04: bash scripts/setup-server.sh

set -e

echo "==> Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "==> Installing PM2 + Nginx + Certbot..."
npm install -g pm2
apt-get install -y nginx certbot python3-certbot-nginx

echo "==> Cloning repo..."
mkdir -p /var/www
cd /var/www
git clone https://github.com/CRAPAPS/DUTCH-KICKS.git dutch-kicks
cd dutch-kicks

echo "==> Writing .env.local..."
cat > .env.local << 'ENVEOF'
NEXT_PUBLIC_SUPABASE_URL=https://kovnrrblntwipabmeobq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvdm5ycmJsbnR3aXBhYm1lb2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxOTQ3MiwiZXhwIjoyMDkzMzk1NDcyfQ.8VO95jAoXUav6in6YxKeRtlEU6mwRRLwXcQ32Glu938
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvdm5ycmJsbnR3aXBhYm1lb2JxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzgxOTQ3MiwiZXhwIjoyMDkzMzk1NDcyfQ.wO3qtQtzrtnsjE0UsgTLSgCKaoy3-Oq-r4u-q9qCgFk
ANTHROPIC_API_KEY=
WHATNOT_WEBHOOK_SECRET=
ENVEOF

echo "==> Installing dependencies and building..."
npm ci
npm run build

echo "==> Starting app with PM2..."
pm2 start npm --name "dutch-kicks" -- start
pm2 startup systemd
pm2 save

echo "==> Configuring Nginx..."
cp /var/www/dutch-kicks/nginx/dutch-kicks.conf /etc/nginx/sites-available/dutch-kicks
ln -sf /etc/nginx/sites-available/dutch-kicks /etc/nginx/sites-enabled/dutch-kicks
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo "==> Done. App running at http://2.24.66.66"
echo "==> Once DNS is live, run: certbot --nginx -d dutchkicks.com -d www.dutchkicks.com"
