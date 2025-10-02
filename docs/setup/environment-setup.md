# Environment Configuration Guide

This guide covers all environment variables required for the CueLABS™ platform, including development and production configurations. Proper environment setup is crucial for the application to function correctly.

## Overview

The CueLABS™ platform uses environment variables to configure:

- Database connections (Airtable)
- Authentication (NextAuth.js with GitHub OAuth)
- Analytics and monitoring
- Application behavior settings

## Environment Files

### Development Environment

- **File**: `.env.local` (in project root)
- **Purpose**: Local development configuration
- **Git**: Should be ignored (already in `.gitignore`)

### Production Environment

- **Configuration**: Set via your deployment platform
- **Examples**: Vercel Environment Variables, Railway, Netlify, etc.

## Required Environment Variables

### Database Configuration

#### AIRTABLE_API_KEY

- **Description**: Personal access token for Airtable API
- **Required**: Yes
- **Format**: `pat...` (starts with "pat")
- **Example**: `patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- **Setup**: See [Airtable Setup Guide](./airtable-setup.md)

```env
AIRTABLE_API_KEY=your_airtable_personal_access_token
```

#### AIRTABLE_BASE_ID

- **Description**: Unique identifier for your Airtable base
- **Required**: Yes
- **Format**: `app...` (starts with "app")
- **Example**: `appXXXXXXXXXXXXXX`
- **Setup**: See [Airtable Setup Guide](./airtable-setup.md)

```env
AIRTABLE_BASE_ID=your_airtable_base_id
```

### Authentication Configuration

#### NEXTAUTH_URL

- **Description**: Canonical URL of your application
- **Required**: Yes
- **Development**: `http://localhost:3000`
- **Production**: Your actual domain with HTTPS

```env
# Development
NEXTAUTH_URL=http://localhost:3000

# Production
NEXTAUTH_URL=https://your-domain.com
```

#### NEXTAUTH_SECRET

- **Description**: Secret key for encrypting JWT tokens and sessions
- **Required**: Yes
- **Format**: Base64 encoded string (32+ characters recommended)
- **Generation**: `openssl rand -base64 32`

```env
NEXTAUTH_SECRET=your_generated_secret_key_here
```

#### GITHUB_CLIENT_ID

- **Description**: GitHub OAuth application client ID
- **Required**: Yes
- **Format**: `Iv1.` followed by 16 characters
- **Setup**: See [GitHub OAuth Setup Guide](./github-oauth-setup.md)

```env
GITHUB_CLIENT_ID=your_github_client_id
```

#### GITHUB_CLIENT_SECRET

- **Description**: GitHub OAuth application client secret
- **Required**: Yes
- **Format**: 40-character hexadecimal string
- **Security**: Keep this secret and never commit to version control
- **Setup**: See [GitHub OAuth Setup Guide](./github-oauth-setup.md)

```env
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Optional Configuration

#### VERCEL_ANALYTICS_ID

- **Description**: Vercel Analytics project ID for tracking
- **Required**: No
- **Format**: String identifier
- **Usage**: Only needed if using Vercel Analytics

```env
VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

#### NODE_ENV

- **Description**: Application environment mode
- **Required**: No (automatically set by most platforms)
- **Values**: `development`, `production`, `test`
- **Default**: Set by your runtime environment

```env
NODE_ENV=development
```

## Complete Environment File Examples

### Development (.env.local)

```env
# Database Configuration
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# Authentication Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_32_character_base64_secret_here
GITHUB_CLIENT_ID=Iv1.a1b2c3d4e5f6g7h8
GITHUB_CLIENT_SECRET=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0

# Optional Analytics
VERCEL_ANALYTICS_ID=your_analytics_id

# Development Settings
NODE_ENV=development
```

### Production Environment

```env
# Database Configuration (Production Airtable)
AIRTABLE_API_KEY=patPROD_XXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appPROD_XXXXXXXXXX

# Authentication Configuration (Production)
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=your_production_secret_different_from_dev
GITHUB_CLIENT_ID=Iv1.production_client_id
GITHUB_CLIENT_SECRET=production_client_secret_40_chars

# Production Analytics
VERCEL_ANALYTICS_ID=prod_analytics_id

# Production Settings
NODE_ENV=production
```

## Environment Variable Validation

The application includes runtime validation for required environment variables. Missing variables will cause startup errors with helpful messages.

### Validation Schema

```typescript
// Environment validation (for reference)
const envSchema = {
  AIRTABLE_API_KEY: { required: true, pattern: /^pat/ },
  AIRTABLE_BASE_ID: { required: true, pattern: /^app/ },
  NEXTAUTH_URL: { required: true, pattern: /^https?:\/\// },
  NEXTAUTH_SECRET: { required: true, minLength: 32 },
  GITHUB_CLIENT_ID: { required: true, pattern: /^Iv1\./ },
  GITHUB_CLIENT_SECRET: { required: true, minLength: 40 },
  VERCEL_ANALYTICS_ID: { required: false },
  NODE_ENV: { required: false, enum: ['development', 'production', 'test'] }
}
```

## Setup Instructions

### 1. Create Environment File

For development, create `.env.local` in your project root:

```bash
# Navigate to project root
cd your-project-directory

# Create environment file
touch .env.local

# Edit with your preferred editor
nano .env.local
# or
code .env.local
```

### 2. Configure Required Services

Before setting environment variables, ensure you have:

1. **Airtable Base**: Follow [Airtable Setup Guide](./airtable-setup.md)
2. **GitHub OAuth App**: Follow [GitHub OAuth Setup Guide](./github-oauth-setup.md)

### 3. Generate Secrets

Generate a secure NextAuth secret:

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Verify Configuration

Test your environment setup:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Check for environment errors in console
```

## Development vs Production Differences

### Key Differences

| Aspect | Development | Production |
|--------|-------------|------------|
| **Domain** | `localhost:3000` | Your production domain |
| **Protocol** | HTTP allowed | HTTPS required |
| **Secrets** | Can be simpler | Must be cryptographically secure |
| **Airtable** | Can use test data | Should use production data |
| **GitHub OAuth** | Separate OAuth app | Separate OAuth app |
| **Analytics** | Optional/test mode | Production tracking |

### Security Considerations

#### Development

- Use test data when possible
- Separate OAuth applications
- Different Airtable bases for testing
- Simpler secrets are acceptable

#### Production

- Use strong, unique secrets
- Enable all security features
- Monitor for security issues
- Regular secret rotation
- Secure environment variable storage

## Platform-Specific Setup

### Vercel

1. Go to your project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add each variable with appropriate environment (Production, Preview, Development)

```bash
# Using Vercel CLI
vercel env add AIRTABLE_API_KEY
vercel env add AIRTABLE_BASE_ID
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add GITHUB_CLIENT_ID
vercel env add GITHUB_CLIENT_SECRET
```

### Railway

1. Go to your project dashboard
2. Navigate to "Variables" tab
3. Add each environment variable

### Netlify

1. Go to site settings
2. Navigate to "Environment variables"
3. Add each variable

### Docker

Create a `.env` file for Docker Compose:

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    env_file:
      - .env
    ports:
      - "3000:3000"
```

## Troubleshooting

### Common Issues

#### "Environment variable not found" Error

**Symptoms**: Application fails to start with missing variable error

**Solutions**:

1. Check variable name spelling (case-sensitive)
2. Ensure `.env.local` is in project root
3. Restart development server after adding variables
4. Verify no extra spaces around `=` sign

#### "Invalid Airtable credentials" Error

**Symptoms**: Database connection fails

**Solutions**:

1. Verify `AIRTABLE_API_KEY` starts with `pat`
2. Check `AIRTABLE_BASE_ID` starts with `app`
3. Ensure token has correct permissions
4. Verify base ID matches your actual base

#### "GitHub OAuth failed" Error

**Symptoms**: Authentication doesn't work

**Solutions**:

1. Check `GITHUB_CLIENT_ID` format (`Iv1.` prefix)
2. Verify `GITHUB_CLIENT_SECRET` is 40 characters
3. Ensure OAuth app callback URL matches `NEXTAUTH_URL`
4. Check OAuth app is not suspended

#### "NextAuth configuration error"

**Symptoms**: Authentication system fails to initialize

**Solutions**:

1. Verify `NEXTAUTH_SECRET` is at least 32 characters
2. Check `NEXTAUTH_URL` includes protocol (`http://` or `https://`)
3. Ensure URL matches your actual domain
4. Regenerate secret if needed

### Environment Variable Debugging

#### Check Current Environment

```bash
# View all environment variables (be careful with secrets)
printenv | grep -E "(AIRTABLE|NEXTAUTH|GITHUB)"

# Check specific variable
echo $AIRTABLE_API_KEY
```

#### Validate Format

```bash
# Check Airtable API key format
echo $AIRTABLE_API_KEY | grep -E "^pat"

# Check Airtable Base ID format
echo $AIRTABLE_BASE_ID | grep -E "^app"

# Check GitHub Client ID format
echo $GITHUB_CLIENT_ID | grep -E "^Iv1\."
```

#### Test Configuration

Create a simple test script:

```javascript
// test-env.js
const requiredVars = [
  'AIRTABLE_API_KEY',
  'AIRTABLE_BASE_ID',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET'
];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.error(`❌ Missing: ${varName}`);
  } else {
    console.log(`✅ Found: ${varName} (${value.length} chars)`);
  }
});
```

Run with: `node test-env.js`

## Security Best Practices

### Secret Management

- Never commit secrets to version control
- Use different secrets for each environment
- Rotate secrets regularly
- Use secure secret generation methods
- Store production secrets in secure vaults

### Access Control

- Limit Airtable token permissions to minimum required
- Use separate GitHub OAuth apps for each environment
- Regularly audit access permissions
- Monitor for unauthorized access

### Monitoring

- Set up alerts for authentication failures
- Monitor API usage and rate limits
- Log security-relevant events
- Regular security audits

## Next Steps

After configuring your environment:

1. **Test the Setup**: Verify all integrations work correctly
2. **Deploy**: Set up production environment variables
3. **Monitor**: Implement logging and monitoring
4. **Document**: Keep environment documentation updated
5. **Secure**: Regular security reviews and updates

## Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Environment Variable Security](https://owasp.org/www-community/vulnerabilities/Insecure_Storage_of_Sensitive_Information)
