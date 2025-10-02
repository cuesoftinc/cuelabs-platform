# Vercel Deployment Guide

## Overview

This guide walks you through deploying the CueLABS™ platform to Vercel, including environment configuration, domain setup, and production optimizations.

## Prerequisites

Before deploying to Vercel, ensure you have:

- A GitHub repository with your CueLABS™ code
- A Vercel account (free tier available)
- Airtable base configured with required tables
- GitHub OAuth app configured for production
- Domain name (optional, for custom domains)

## Quick Deployment

### 1. Connect GitHub Repository

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Select your CueLABS™ repository
   - Click "Import"

3. **Configure Project**
   - Project Name: `cuelabs-platform`
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)

### 2. Environment Variables Setup

Add the following environment variables in Vercel dashboard:

#### Required Variables

```bash
# Application Configuration
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-key

# Airtable Configuration
AIRTABLE_API_KEY=your-airtable-api-key
AIRTABLE_BASE_ID=your-airtable-base-id

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Analytics (Optional)
VERCEL_ANALYTICS_ID=your-analytics-id
```

#### Setting Environment Variables

1. Go to your project dashboard in Vercel
2. Navigate to "Settings" → "Environment Variables"
3. Add each variable with appropriate values
4. Set environment scope (Production, Preview, Development)

### 3. Deploy

1. Click "Deploy" in Vercel dashboard
2. Wait for build to complete (typically 2-3 minutes)
3. Visit your deployment URL to verify

## Detailed Configuration

### Build Settings

Vercel automatically detects Next.js projects, but you can customize:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "devCommand": "npm run dev"
}
```

### Vercel Configuration File

Create `vercel.json` in your project root for advanced configuration:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/dashboard",
      "destination": "/platform/dashboard",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/health",
      "destination": "/api/health"
    }
  ]
}
```

## Environment-Specific Configuration

### Production Environment

```bash
# Production (.env.production)
NODE_ENV=production
NEXTAUTH_URL=https://cuelabs.cuesoft.io
NEXTAUTH_SECRET=super-secure-production-secret

# Production Airtable
AIRTABLE_API_KEY=keyPRODUCTION123
AIRTABLE_BASE_ID=appPRODUCTION456

# Production GitHub OAuth
GITHUB_CLIENT_ID=prod_client_id
GITHUB_CLIENT_SECRET=prod_client_secret

# Analytics
VERCEL_ANALYTICS_ID=analytics_id
```

### Staging Environment

```bash
# Staging (.env.staging)
NODE_ENV=production
NEXTAUTH_URL=https://staging-cuelabs.vercel.app
NEXTAUTH_SECRET=staging-secret-key

# Staging Airtable
AIRTABLE_API_KEY=keySTAGING123
AIRTABLE_BASE_ID=appSTAGING456

# Staging GitHub OAuth
GITHUB_CLIENT_ID=staging_client_id
GITHUB_CLIENT_SECRET=staging_client_secret
```

### Preview Environment

```bash
# Preview (.env.preview)
NODE_ENV=production
NEXTAUTH_URL=https://preview-branch.vercel.app
NEXTAUTH_SECRET=preview-secret-key

# Development Airtable (safe for testing)
AIRTABLE_API_KEY=keyDEVELOPMENT123
AIRTABLE_BASE_ID=appDEVELOPMENT456

# Development GitHub OAuth
GITHUB_CLIENT_ID=dev_client_id
GITHUB_CLIENT_SECRET=dev_client_secret
```

## Custom Domain Setup

### 1. Add Domain in Vercel

1. Go to project "Settings" → "Domains"
2. Add your custom domain (e.g., `cuelabs.cuesoft.io`)
3. Vercel will provide DNS configuration

### 2. Configure DNS

#### Option A: Vercel Nameservers (Recommended)

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

#### Option B: CNAME Record

```
Type: CNAME
Name: www (or @)
Value: cname.vercel-dns.com
```

#### Option C: A Record

```
Type: A
Name: @
Value: 76.76.19.61
```

### 3. SSL Certificate

Vercel automatically provisions SSL certificates for custom domains:

- Let's Encrypt certificates
- Automatic renewal
- HTTPS redirect enabled by default

### 4. Update Environment Variables

After domain setup, update:

```bash
NEXTAUTH_URL=https://your-custom-domain.com
```

## GitHub OAuth Configuration

### Production OAuth App

1. **Create GitHub OAuth App**
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"

2. **Configure Application**

   ```
   Application name: CueLABS™ Platform
   Homepage URL: https://cuelabs.cuesoft.io
   Authorization callback URL: https://cuelabs.cuesoft.io/api/auth/callback/github
   ```

3. **Update Environment Variables**

   ```bash
   GITHUB_CLIENT_ID=your_production_client_id
   GITHUB_CLIENT_SECRET=your_production_client_secret
   ```

### Multiple Environment Setup

Create separate OAuth apps for each environment:

- **Production**: `https://cuelabs.cuesoft.io/api/auth/callback/github`
- **Staging**: `https://staging-cuelabs.vercel.app/api/auth/callback/github`
- **Preview**: `https://preview-*.vercel.app/api/auth/callback/github`

## Deployment Workflow

### Automatic Deployments

Vercel automatically deploys when you push to connected branches:

```yaml
# Deployment triggers
main branch → Production deployment
feature/* → Preview deployment
Pull requests → Preview deployment
```

### Manual Deployments

Deploy manually using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### Deployment Commands

```bash
# Build and deploy
npm run build
vercel --prod

# Deploy with environment
vercel --prod --env NODE_ENV=production

# Deploy specific branch
vercel --prod --target production
```

## Performance Optimization

### Build Optimization

```json
// next.config.ts
const nextConfig = {
  // Enable compression
  compress: true,

  // Optimize images
  images: {
    domains: ['dl.airtable.com', 'avatars.githubusercontent.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(new BundleAnalyzerPlugin());
      return config;
    },
  }),

  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
};
```

### Vercel Functions Optimization

```json
// vercel.json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024,
      "runtime": "nodejs18.x"
    }
  }
}
```

### Caching Strategy

```javascript
// Cache configuration
export const revalidate = 3600; // 1 hour

// API route caching
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
```

## Monitoring and Analytics

### Vercel Analytics

Enable analytics in `vercel.json`:

```json
{
  "analytics": {
    "id": "your-analytics-id"
  }
}
```

### Performance Monitoring

```typescript
// pages/_app.tsx or app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### Error Tracking

```typescript
// lib/error-tracking.ts
export function trackError(error: Error, context?: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
    console.error('Production error:', error, context);
  }
}
```

## Security Configuration

### Security Headers

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

### Environment Security

- Use Vercel's encrypted environment variables
- Never commit secrets to repository
- Rotate secrets regularly
- Use different secrets for each environment

## Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Check build logs
vercel logs

# Local build test
npm run build

# Clear cache and rebuild
vercel --force
```

#### Environment Variable Issues

```bash
# Verify environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

#### Domain Configuration Issues

1. **DNS Propagation**: Wait 24-48 hours for DNS changes
2. **SSL Issues**: Check certificate status in Vercel dashboard
3. **Redirect Loops**: Verify NEXTAUTH_URL matches domain

#### OAuth Callback Issues

1. **Callback URL Mismatch**: Ensure GitHub OAuth app callback URL matches deployment URL
2. **Environment Variables**: Verify GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET
3. **NEXTAUTH_URL**: Must match the domain users access

### Debug Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Inspect environment
vercel env ls

# Test locally with production build
npm run build && npm start
```

### Support Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **CueLABS™ Issues**: [github.com/cuesoftinc/cuelabs-platform/issues](https://github.com/cuesoftinc/cuelabs-platform/issues)
