# Galileo V2.2 Deployment Guide

## 🚀 Production Deployment Guide

**Version:** 2.2.0  
**Target Environment:** Production  
**Deployment Type:** Web Application

---

## 📋 Prerequisites

### System Requirements
- **Node.js:** 18.0.0 or higher
- **npm/pnpm:** Latest stable version
- **Git:** For version control
- **Web Server:** Nginx, Apache, or cloud hosting service
- **SSL Certificate:** For HTTPS (required for production)

### Development Environment
- **Operating System:** Windows 10/11, macOS, or Linux
- **Memory:** 8GB RAM minimum (16GB recommended)
- **Storage:** 10GB available space
- **Network:** Stable internet connection

---

## 🔧 Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All tests passing (216/216)
- [ ] Code coverage > 85% for critical services
- [ ] No linting errors
- [ ] Security audit completed
- [ ] Performance benchmarks met

### ✅ Environment Configuration
- [ ] Production environment variables set
- [ ] API keys and secrets configured
- [ ] Database connections established
- [ ] External service integrations tested
- [ ] SSL certificates installed

### ✅ Infrastructure
- [ ] Web server configured
- [ ] Domain and DNS configured
- [ ] CDN setup (optional but recommended)
- [ ] Monitoring and logging configured
- [ ] Backup procedures established

---

## 🚀 Deployment Steps

### Step 1: Environment Setup

```bash
# Clone the repository
git clone https://github.com/marshrp88/AlphaFrame.git
cd AlphaFrame

# Navigate to web application
cd apps/web

# Install dependencies
pnpm install

# Verify installation
pnpm test
```

### Step 2: Production Build

```bash
# Create production build
pnpm build

# Verify build output
ls -la dist/
```

**Expected Output:**
- `index.html` - Main application entry point
- `assets/` - Compiled JavaScript, CSS, and other assets
- `vite.svg` - Application icon

### Step 3: Environment Configuration

Create a `.env.production` file in `apps/web/`:

```env
# Production Environment Variables
NODE_ENV=production
VITE_APP_TITLE=AlphaFrame Galileo V2.2
VITE_API_BASE_URL=https://api.alphaframe.com
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false

# Security Configuration
VITE_ENABLE_HTTPS=true
VITE_ENABLE_CSP=true

# Feature Flags
VITE_ENABLE_ADVANCED_FEATURES=true
VITE_ENABLE_BETA_FEATURES=false
```

### Step 4: Web Server Configuration

#### Nginx Configuration

Create `/etc/nginx/sites-available/alphaframe`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Root directory
    root /var/www/alphaframe/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (if needed)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Apache Configuration

Create `.htaccess` in the `dist/` directory:

```apache
# Enable rewrite engine
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-XSS-Protection "1; mode=block"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "no-referrer-when-downgrade"

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, immutable"
</FilesMatch>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

### Step 5: Deployment Script

Create a deployment script `deploy.sh`:

```bash
#!/bin/bash

# Galileo V2.2 Deployment Script
set -e

echo "🚀 Starting Galileo V2.2 deployment..."

# Variables
APP_DIR="/var/www/alphaframe"
BACKUP_DIR="/var/backups/alphaframe"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup
echo "📦 Creating backup..."
if [ -d "$APP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    cp -r "$APP_DIR" "$BACKUP_DIR/backup_$TIMESTAMP"
fi

# Pull latest code
echo "📥 Pulling latest code..."
cd /path/to/AlphaFrame
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
cd apps/web
pnpm install

# Run tests
echo "🧪 Running tests..."
pnpm test

# Build for production
echo "🔨 Building for production..."
pnpm build

# Deploy to web server
echo "🚀 Deploying to web server..."
sudo cp -r dist/* "$APP_DIR/"

# Set permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data "$APP_DIR"
sudo chmod -R 755 "$APP_DIR"

# Restart web server
echo "🔄 Restarting web server..."
sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"
echo "🌐 Application available at: https://your-domain.com"
```

### Step 6: Monitoring Setup

#### Application Monitoring

Install monitoring tools:

```bash
# Install PM2 for process management
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'alphaframe',
    script: 'pnpm',
    args: 'dev',
    cwd: '/path/to/AlphaFrame/apps/web',
    env: {
      NODE_ENV: 'production'
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G'
  }]
}
EOF

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Log Monitoring

Configure log rotation:

```bash
# Create logrotate configuration
sudo tee /etc/logrotate.d/alphaframe << EOF
/var/log/alphaframe/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
EOF
```

---

## 🔍 Post-Deployment Verification

### Health Checks

```bash
# Check application status
curl -I https://your-domain.com

# Verify SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Check performance
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com
```

### Performance Testing

```bash
# Run Lighthouse audit
npx lighthouse https://your-domain.com --output html --output-path ./lighthouse-report.html

# Run WebPageTest
# Visit https://www.webpagetest.org/ and test your domain
```

### Security Testing

```bash
# Run security scan
npx audit-ci --moderate

# Check for vulnerabilities
npm audit

# Test CSP headers
curl -I https://your-domain.com | grep -i "content-security-policy"
```

---

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
pnpm install
pnpm build
```

#### SSL Issues
```bash
# Check SSL configuration
sudo nginx -t
sudo systemctl status nginx

# Renew SSL certificate (if using Let's Encrypt)
sudo certbot renew
```

#### Performance Issues
```bash
# Check server resources
htop
df -h
free -h

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## 📊 Monitoring & Maintenance

### Regular Maintenance Tasks

#### Daily
- [ ] Check application logs for errors
- [ ] Monitor server resources
- [ ] Verify backup completion

#### Weekly
- [ ] Review performance metrics
- [ ] Update dependencies
- [ ] Check security advisories

#### Monthly
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Backup restoration test

### Backup Strategy

```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR="/var/backups/alphaframe"
DATE=$(date +%Y%m%d_%H%M%S)

# Application backup
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" /var/www/alphaframe

# Database backup (if applicable)
# mysqldump -u username -p database > "$BACKUP_DIR/db_$DATE.sql"

# Clean old backups (keep 30 days)
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete
```

---

## 📞 Support

### Emergency Contacts
- **Technical Support:** support@alphaframe.com
- **Security Issues:** security@alphaframe.com
- **Documentation:** docs.alphaframe.com

### Useful Commands
```bash
# Check application status
pm2 status

# View logs
pm2 logs alphaframe

# Restart application
pm2 restart alphaframe

# Monitor resources
pm2 monit
```

---

*This deployment guide ensures a smooth, secure, and maintainable production deployment of Galileo V2.2.* 