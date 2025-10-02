# Domain and DNS Configuration Guide

## Overview

This guide covers setting up custom domains and DNS configuration for the CueLABS™ platform deployed on Vercel, including SSL certificates, subdomain management, and DNS best practices.

## Domain Setup Options

### Option 1: Vercel Nameservers (Recommended)

**Pros:**

- Automatic SSL certificate management
- Optimal performance with Vercel's edge network
- Simplified DNS management
- Automatic HTTPS redirects

**Cons:**

- Must transfer DNS management to Vercel
- Limited advanced DNS features

### Option 2: External DNS Provider

**Pros:**

- Keep existing DNS provider
- Advanced DNS features available
- More control over DNS records

**Cons:**

- Manual SSL certificate management
- Requires DNS configuration knowledge
- Potential performance impact

## Setting Up Custom Domain

### Step 1: Add Domain in Vercel

1. **Navigate to Project Settings**
   - Go to your Vercel project dashboard
   - Click "Settings" tab
   - Select "Domains"

2. **Add Your Domain**
   - Click "Add Domain"
   - Enter your domain (e.g., `cuelabs.cuesoft.io`)
   - Click "Add"

3. **Choose Configuration Method**
   - Vercel will detect your current DNS setup
   - Choose between nameservers or DNS records

### Step 2: DNS Configuration

#### Option A: Vercel Nameservers

1. **Get Nameservers from Vercel**

   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

2. **Update at Domain Registrar**
   - Log into your domain registrar (GoDaddy, Namecheap, etc.)
   - Navigate to DNS/Nameserver settings
   - Replace existing nameservers with Vercel's
   - Save changes

3. **Wait for Propagation**
   - DNS changes can take 24-48 hours to propagate
   - Use `dig` or online tools to check status

#### Option B: DNS Records

1. **A Record Configuration**

   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   TTL: 3600
   ```

2. **CNAME Record for www**

   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **Alternative CNAME Setup**

   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

### Step 3: Verify Domain

1. **Check Domain Status**
   - Return to Vercel dashboard
   - Verify domain shows "Valid Configuration"
   - SSL certificate should be "Active"

2. **Test Domain Access**

   ```bash
   # Test HTTP redirect to HTTPS
   curl -I http://cuelabs.cuesoft.io

   # Test HTTPS access
   curl -I https://cuelabs.cuesoft.io

   # Test www redirect
   curl -I https://www.cuelabs.cuesoft.io
   ```

## Subdomain Configuration

### Common Subdomains

#### Staging Environment

```
Subdomain: staging-cuelabs.cuesoft.io
Purpose: Pre-production testing
Configuration: CNAME to Vercel deployment URL
```

#### API Subdomain

```
Subdomain: api.cuelabs.cuesoft.io
Purpose: API endpoint (optional)
Configuration: CNAME to main domain
```

#### Documentation

```
Subdomain: docs.cuelabs.cuesoft.io
Purpose: Documentation site
Configuration: Separate Vercel project or CNAME
```

### Setting Up Subdomains

1. **Add Subdomain in Vercel**
   - Follow same process as main domain
   - Add `staging-cuelabs.cuesoft.io` as new domain

2. **DNS Configuration**

   ```
   Type: CNAME
   Name: staging
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **Environment-Specific Deployment**

   ```bash
   # Deploy staging branch to subdomain
   vercel --target staging
   ```

## SSL Certificate Management

### Automatic SSL (Vercel Managed)

Vercel automatically provides SSL certificates when:

- Domain is properly configured
- DNS is pointing to Vercel
- Domain verification is complete

**Features:**

- Let's Encrypt certificates
- Automatic renewal
- Wildcard certificates for subdomains
- HTTPS redirect enabled by default

### Certificate Status Check

```bash
# Check SSL certificate
openssl s_client -connect cuelabs.cuesoft.io:443 -servername cuelabs.cuesoft.io

# Check certificate expiration
echo | openssl s_client -connect cuelabs.cuesoft.io:443 2>/dev/null | openssl x509 -noout -dates
```

### Custom SSL Certificates

For enterprise needs, you can upload custom certificates:

1. **Generate Certificate**

   ```bash
   # Generate private key
   openssl genrsa -out private.key 2048

   # Generate certificate signing request
   openssl req -new -key private.key -out certificate.csr

   # Get certificate from CA
   ```

2. **Upload to Vercel**
   - Go to project settings
   - Navigate to "SSL Certificates"
   - Upload certificate and private key

## DNS Best Practices

### TTL Configuration

```
Record Type | Recommended TTL | Purpose
A Record     | 3600 (1 hour)   | Balance between performance and flexibility
CNAME        | 3600 (1 hour)   | Standard for aliases
MX Record    | 86400 (24 hours)| Email routing (if applicable)
TXT Record   | 3600 (1 hour)   | Verification and security
```

### Security Records

#### SPF Record (Email Security)

```
Type: TXT
Name: @
Value: "v=spf1 -all"
```

#### DMARC Record (Email Security)

```
Type: TXT
Name: _dmarc
Value: "v=DMARC1; p=reject; rua=mailto:dmarc@cuelabs.cuesoft.io"
```

#### CAA Record (Certificate Authority Authorization)

```
Type: CAA
Name: @
Value: 0 issue "letsencrypt.org"
```

### Performance Optimization

#### CNAME Flattening

Some DNS providers offer CNAME flattening for apex domains:

```
Type: ALIAS (or ANAME)
Name: @
Value: cname.vercel-dns.com
```

#### Geographic DNS

For global performance, consider GeoDNS:

```
US Traffic → us-east.vercel-dns.com
EU Traffic → eu-west.vercel-dns.com
APAC Traffic → asia-southeast.vercel-dns.com
```

## Environment-Specific Domains

### Production Domain

```
Domain: cuelabs.cuesoft.io
Aliases: www.cuelabs.cuesoft.io
SSL: Automatic (Let's Encrypt)
Redirects: www → apex domain
```

### Staging Domain

```
Domain: staging-cuelabs.cuesoft.io
Purpose: Pre-production testing
Access: Team members only (optional auth)
SSL: Automatic (Let's Encrypt)
```

### Development Domain

```
Domain: dev.cuelabs.cuesoft.io (optional)
Purpose: Development testing
Access: Developers only
SSL: Automatic (Let's Encrypt)
```

## Vercel Configuration

### Domain Redirects

Configure in `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/dashboard",
      "destination": "/platform/dashboard",
      "permanent": true
    },
    {
      "source": "/admin",
      "destination": "/platform/admin",
      "permanent": true
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

### Custom Error Pages

```json
{
  "errorPage": "/error.html",
  "routes": [
    {
      "src": "/.*",
      "status": 404,
      "dest": "/404.html"
    }
  ]
}
```

## Monitoring and Maintenance

### DNS Monitoring

Set up monitoring for:

- Domain resolution time
- SSL certificate expiration
- DNS record changes
- Uptime monitoring

### Tools for Monitoring

```bash
# Check DNS propagation
dig cuelabs.cuesoft.io
dig www.cuelabs.cuesoft.io

# Check from different locations
nslookup cuelabs.cuesoft.io 8.8.8.8
nslookup cuelabs.cuesoft.io 1.1.1.1

# SSL certificate check
curl -vI https://cuelabs.cuesoft.io 2>&1 | grep -i certificate
```

### Automated Monitoring Script

```bash
#!/bin/bash
# dns-monitor.sh

DOMAIN="cuelabs.cuesoft.io"
EXPECTED_IP="76.76.19.61"

# Check A record
ACTUAL_IP=$(dig +short $DOMAIN @8.8.8.8)

if [ "$ACTUAL_IP" = "$EXPECTED_IP" ]; then
    echo "✅ DNS A record is correct: $ACTUAL_IP"
else
    echo "❌ DNS A record mismatch. Expected: $EXPECTED_IP, Got: $ACTUAL_IP"
    # Send alert (email, Slack, etc.)
fi

# Check SSL certificate expiration
CERT_EXPIRY=$(echo | openssl s_client -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
EXPIRY_TIMESTAMP=$(date -d "$CERT_EXPIRY" +%s)
CURRENT_TIMESTAMP=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_TIMESTAMP - $CURRENT_TIMESTAMP) / 86400 ))

if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
    echo "⚠️  SSL certificate expires in $DAYS_UNTIL_EXPIRY days"
    # Send alert
else
    echo "✅ SSL certificate is valid for $DAYS_UNTIL_EXPIRY days"
fi
```

## Troubleshooting

### Common DNS Issues

#### Domain Not Resolving

1. **Check DNS Propagation**

   ```bash
   dig cuelabs.cuesoft.io
   nslookup cuelabs.cuesoft.io
   ```

2. **Verify DNS Records**
   - Check A record points to correct IP
   - Verify CNAME records are correct
   - Ensure no conflicting records

3. **Wait for Propagation**
   - DNS changes can take up to 48 hours
   - Use different DNS servers to test
   - Clear local DNS cache

#### SSL Certificate Issues

1. **Certificate Not Issued**
   - Verify domain ownership
   - Check DNS configuration
   - Ensure domain is accessible via HTTP

2. **Certificate Expired**
   - Vercel auto-renews Let's Encrypt certificates
   - Check Vercel dashboard for certificate status
   - Contact Vercel support if auto-renewal fails

#### Redirect Loops

1. **Check HTTPS Redirects**
   - Verify Vercel HTTPS redirect settings
   - Check for conflicting redirects in code
   - Review `vercel.json` configuration

2. **WWW vs Apex Domain**
   - Configure primary domain preference
   - Set up proper redirects
   - Update `NEXTAUTH_URL` to match primary domain

### Debug Commands

```bash
# Check DNS from multiple servers
dig @8.8.8.8 cuelabs.cuesoft.io
dig @1.1.1.1 cuelabs.cuesoft.io
dig @208.67.222.222 cuelabs.cuesoft.io

# Trace DNS resolution
dig +trace cuelabs.cuesoft.io

# Check HTTP headers
curl -I https://cuelabs.cuesoft.io

# Test SSL handshake
openssl s_client -connect cuelabs.cuesoft.io:443 -servername cuelabs.cuesoft.io

# Check certificate chain
openssl s_client -connect cuelabs.cuesoft.io:443 -showcerts
```

### Getting Help

1. **Vercel Support**
   - Check Vercel status page
   - Contact support through dashboard
   - Community forums and Discord

2. **DNS Provider Support**
   - Contact your domain registrar
   - Check provider documentation
   - Use provider's DNS tools

3. **Community Resources**
   - Vercel community discussions
   - Stack Overflow
   - DNS troubleshooting guides

## Migration Checklist

When migrating domains or changing DNS:

- [ ] Backup current DNS records
- [ ] Plan migration during low-traffic period
- [ ] Update environment variables (`NEXTAUTH_URL`)
- [ ] Test new configuration in staging
- [ ] Monitor DNS propagation
- [ ] Verify SSL certificate issuance
- [ ] Test all application functionality
- [ ] Update any hardcoded domain references
- [ ] Notify team of changes
- [ ] Monitor for issues post-migration
