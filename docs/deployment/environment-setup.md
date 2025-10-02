# Environment Setup Guide

## Overview

This guide covers setting up environment variables and configuration for different deployment environments (development, staging, production) of the CueLABS™ platform.

## Environment Types

### Development Environment

- **Purpose**: Local development and testing
- **URL**: `http://localhost:3000`
- **Database**: Development Airtable base
- **OAuth**: Development GitHub OAuth app

### Staging Environment

- **Purpose**: Pre-production testing and QA
- **URL**: `https://staging-cuelabs.vercel.app`
- **Database**: Staging Airtable base (copy of production)
- **OAuth**: Staging GitHub OAuth app

### Production Environment

- **Purpose**: Live application for users
- **URL**: `https://cuelabs.cuesoft.io`
- **Database**: Production Airtable base
- **OAuth**: Production GitHub OAuth app

## Environment Variables

### Core Application Variables

#### NEXTAUTH_URL

The base URL of your application.

```bash
# Development
NEXTAUTH_URL=http://localhost:3000

# Staging
NEXTAUTH_URL=https://staging-cuelabs.vercel.app

# Production
NEXTAUTH_URL=https://cuelabs.cuesoft.io
```

#### NEXTAUTH_SECRET

A secret key used to encrypt JWT tokens and session data.

```bash
# Generate a secure secret
openssl rand -base64 32

# Example (generate your own!)
NEXTAUTH_SECRET=your-super-secure-secret-key-here
```

**Important**: Use different secrets for each environment and never share them.

#### NODE_ENV

Defines the runtime environment.

```bash
# Development
NODE_ENV=development

# Staging & Production
NODE_ENV=production
```

### Airtable Configuration

#### AIRTABLE_API_KEY

Your Airtable API key for database access.

```bash
# Get from: https://airtable.com/account
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
```

#### AIRTABLE_BASE_ID

The ID of your Airtable base.

```bash
# Get from Airtable base URL: https://airtable.com/appXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

### GitHub OAuth Configuration

#### GITHUB_CLIENT_ID

Client ID from your GitHub OAuth app.

```bash
GITHUB_CLIENT_ID=your_github_client_id
```

#### GITHUB_CLIENT_SECRET

Client secret from your GitHub OAuth app.

```bash
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Optional Variables

#### VERCEL_ANALYTICS_ID

Vercel Analytics tracking ID.

```bash
VERCEL_ANALYTICS_ID=your_analytics_id
```

## Environment Files

### Local Development (.env.local)

Create `.env.local` in your project root:

```bash
# Application Configuration
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-key-change-in-production

# Airtable Configuration (Development Base)
AIRTABLE_API_KEY=keyDEVELOPMENT123
AIRTABLE_BASE_ID=appDEVELOPMENT456

# GitHub OAuth (Development App)
GITHUB_CLIENT_ID=dev_client_id_here
GITHUB_CLIENT_SECRET=dev_client_secret_here

# Optional: Analytics (can be omitted in development)
# VERCEL_ANALYTICS_ID=dev_analytics_id
```

### Staging Environment

Configure in Vercel dashboard or `.env.staging`:

```bash
# Application Configuration
NODE_ENV=production
NEXTAUTH_URL=https://staging-cuelabs.vercel.app
NEXTAUTH_SECRET=staging-secret-key-different-from-prod

# Airtable Configuration (Staging Base)
AIRTABLE_API_KEY=keySTAGING123
AIRTABLE_BASE_ID=appSTAGING456

# GitHub OAuth (Staging App)
GITHUB_CLIENT_ID=staging_client_id_here
GITHUB_CLIENT_SECRET=staging_client_secret_here

# Optional: Analytics
VERCEL_ANALYTICS_ID=staging_analytics_id
```

### Production Environment

Configure in Vercel dashboard:

```bash
# Application Configuration
NODE_ENV=production
NEXTAUTH_URL=https://cuelabs.cuesoft.io
NEXTAUTH_SECRET=super-secure-production-secret-key

# Airtable Configuration (Production Base)
AIRTABLE_API_KEY=keyPRODUCTION123
AIRTABLE_BASE_ID=appPRODUCTION456

# GitHub OAuth (Production App)
GITHUB_CLIENT_ID=prod_client_id_here
GITHUB_CLIENT_SECRET=prod_client_secret_here

# Analytics
VERCEL_ANALYTICS_ID=prod_analytics_id
```

## Setting Up Environment Variables

### Local Development

1. **Copy Example File**

   ```bash
   cp .env.example .env.local
   ```

2. **Edit Variables**

   ```bash
   # Edit with your preferred editor
   nano .env.local
   # or
   code .env.local
   ```

3. **Verify Setup**

   ```bash
   npm run dev
   ```

### Vercel Dashboard

1. **Navigate to Project Settings**
   - Go to your Vercel project dashboard
   - Click "Settings" tab
   - Select "Environment Variables"

2. **Add Variables**
   - Click "Add New"
   - Enter variable name and value
   - Select appropriate environments (Production, Preview, Development)
   - Click "Save"

3. **Bulk Import**

   ```bash
   # Using Vercel CLI
   vercel env add NEXTAUTH_SECRET production
   vercel env add AIRTABLE_API_KEY production
   # ... continue for all variables
   ```

### Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add environment variables
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add AIRTABLE_API_KEY production
vercel env add AIRTABLE_BASE_ID production
vercel env add GITHUB_CLIENT_ID production
vercel env add GITHUB_CLIENT_SECRET production

# List environment variables
vercel env ls

# Pull environment variables to local
vercel env pull .env.local
```

## Environment-Specific Configuration

### Airtable Base Setup

#### Development Base

- **Purpose**: Safe testing environment
- **Data**: Sample/test data only
- **Schema**: Mirror of production schema
- **Access**: Development team only

#### Staging Base

- **Purpose**: Pre-production testing
- **Data**: Copy of production data (anonymized if needed)
- **Schema**: Identical to production
- **Access**: QA team and stakeholders

#### Production Base

- **Purpose**: Live user data
- **Data**: Real user information
- **Schema**: Production schema
- **Access**: Minimal, production-only access

### GitHub OAuth Apps

#### Development OAuth App

```
Application name: CueLABS™ Platform (Development)
Homepage URL: http://localhost:3000
Authorization callback URL: http://localhost:3000/api/auth/callback/github
```

#### Staging OAuth App

```
Application name: CueLABS™ Platform (Staging)
Homepage URL: https://staging-cuelabs.vercel.app
Authorization callback URL: https://staging-cuelabs.vercel.app/api/auth/callback/github
```

#### Production OAuth App

```
Application name: CueLABS™ Platform
Homepage URL: https://cuelabs.cuesoft.io
Authorization callback URL: https://cuelabs.cuesoft.io/api/auth/callback/github
```

## Security Best Practices

### Secret Management

1. **Use Strong Secrets**

   ```bash
   # Generate secure secrets
   openssl rand -base64 32
   # or
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. **Rotate Secrets Regularly**
   - Change secrets every 90 days
   - Use different secrets for each environment
   - Update all instances when rotating

3. **Never Commit Secrets**

   ```bash
   # Add to .gitignore
   echo ".env.local" >> .gitignore
   echo ".env.production" >> .gitignore
   echo ".env.staging" >> .gitignore
   ```

### Access Control

1. **Limit Access**
   - Only necessary team members have access to production secrets
   - Use role-based access in Vercel teams
   - Audit access regularly

2. **Environment Isolation**
   - Separate Airtable bases for each environment
   - Different GitHub OAuth apps
   - Isolated analytics tracking

## Validation and Testing

### Environment Validation Script

Create `scripts/validate-env.js`:

```javascript
const requiredVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'AIRTABLE_API_KEY',
  'AIRTABLE_BASE_ID',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET'
];

function validateEnvironment() {
  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`  - ${varName}`));
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');

  // Validate URLs
  try {
    new URL(process.env.NEXTAUTH_URL);
    console.log('✅ NEXTAUTH_URL is a valid URL');
  } catch {
    console.error('❌ NEXTAUTH_URL is not a valid URL');
    process.exit(1);
  }

  // Validate secret length
  if (process.env.NEXTAUTH_SECRET.length < 32) {
    console.warn('⚠️  NEXTAUTH_SECRET should be at least 32 characters');
  }
}

validateEnvironment();
```

### Testing Environment Setup

```bash
# Add to package.json scripts
{
  "scripts": {
    "validate-env": "node scripts/validate-env.js",
    "dev": "npm run validate-env && next dev",
    "build": "npm run validate-env && next build"
  }
}
```

### Health Check Endpoint

Create `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const requiredVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'AIRTABLE_API_KEY',
    'AIRTABLE_BASE_ID',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  const isHealthy = missing.length === 0;

  return NextResponse.json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    ...(missing.length > 0 && { missingVariables: missing })
  }, {
    status: isHealthy ? 200 : 500
  });
}
```

## Troubleshooting

### Common Issues

#### "Configuration Error" in NextAuth

- **Cause**: Missing or incorrect `NEXTAUTH_URL` or `NEXTAUTH_SECRET`
- **Solution**: Verify environment variables are set correctly

#### Airtable Connection Failed

- **Cause**: Invalid `AIRTABLE_API_KEY` or `AIRTABLE_BASE_ID`
- **Solution**: Check API key and base ID in Airtable dashboard

#### GitHub OAuth Not Working

- **Cause**: Callback URL mismatch or invalid credentials
- **Solution**: Verify GitHub OAuth app configuration matches environment

#### Environment Variables Not Loading

- **Cause**: Wrong file name or location
- **Solution**: Ensure `.env.local` is in project root and not committed

### Debug Commands

```bash
# Check environment variables
npm run validate-env

# Test health endpoint
curl http://localhost:3000/api/health

# Verify Vercel environment variables
vercel env ls

# Pull latest environment variables
vercel env pull .env.local
```

### Environment Variable Precedence

Next.js loads environment variables in this order (highest to lowest priority):

1. `process.env`
2. `.env.local`
3. `.env.production` / `.env.development`
4. `.env`

## Migration Between Environments

### Promoting Staging to Production

1. **Backup Production Data**

   ```bash
   # Export Airtable base
   # Use Airtable's export feature or API
   ```

2. **Update Environment Variables**

   ```bash
   # Copy staging variables to production
   vercel env add VARIABLE_NAME production
   ```

3. **Deploy and Test**

   ```bash
   # Deploy to production
   vercel --prod

   # Test health endpoint
   curl https://cuelabs.cuesoft.io/api/health
   ```

### Rolling Back

1. **Revert Deployment**

   ```bash
   # Rollback to previous deployment
   vercel rollback [deployment-url]
   ```

2. **Restore Environment Variables**

   ```bash
   # Restore previous variable values
   vercel env rm VARIABLE_NAME production
   vercel env add VARIABLE_NAME production
   ```
