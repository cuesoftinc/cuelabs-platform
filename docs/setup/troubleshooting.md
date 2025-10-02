# Troubleshooting Guide

This guide covers common issues you might encounter when setting up and running the CueLABS™ platform, along with their solutions.

## Table of Contents

- [Environment Setup Issues](#environment-setup-issues)
- [Airtable Connection Issues](#airtable-connection-issues)
- [GitHub OAuth Issues](#github-oauth-issues)
- [Development Server Issues](#development-server-issues)
- [Build and Deployment Issues](#build-and-deployment-issues)
- [Database and API Issues](#database-and-api-issues)
- [Authentication Issues](#authentication-issues)
- [General Debugging Tips](#general-debugging-tips)

## Environment Setup Issues

### Issue: Missing Environment Variables

**Symptoms:**

- Application fails to start
- Error messages about undefined environment variables
- Authentication not working

**Solutions:**

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Fill in all required variables in `.env`:
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

3. Verify all variables are set:

   ```bash
   # Check if variables are loaded
   node -e "require('dotenv').config(); console.log(process.env.AIRTABLE_API_KEY ? 'Airtable key loaded' : 'Airtable key missing')"
   ```

### Issue: Node.js Version Compatibility

**Symptoms:**

- Build failures
- Package installation errors
- Runtime errors

**Solutions:**

1. Check your Node.js version:

   ```bash
   node --version
   ```

2. Use the correct version (specified in `.nvmrc`):

   ```bash
   # If using nvm
   nvm use

   # Or install the correct version
   nvm install $(cat .nvmrc)
   ```

3. Clear npm cache if needed:

   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

## Airtable Connection Issues

### Issue: Invalid API Key or Base ID

**Symptoms:**

- "Authentication failed" errors
- "Base not found" errors
- API requests returning 401/404 errors

**Solutions:**

1. Verify your Airtable API key:
   - Go to [Airtable Account](https://airtable.com/account)
   - Generate a new personal access token
   - Update `AIRTABLE_API_KEY` in your `.env` file

2. Check your Base ID:
   - Open your Airtable base
   - Go to Help > API documentation
   - Copy the Base ID from the URL or documentation
   - Update `AIRTABLE_BASE_ID` in your `.env` file

3. Test the connection:

   ```bash
   # Test API connection
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        "https://api.airtable.com/v0/YOUR_BASE_ID/Users?maxRecords=1"
   ```

### Issue: Missing Tables or Fields

**Symptoms:**

- "Table not found" errors
- "Field not found" errors
- Data not loading correctly

**Solutions:**

1. Verify your Airtable base structure matches the required schema
2. Check table names are exactly: `Users`, `Bounties`, `Submissions`, `Products`
3. Ensure all required fields exist (see [Airtable Setup Guide](./airtable-setup.md))
4. Check field types match the expected format

## GitHub OAuth Issues

### Issue: OAuth App Configuration

**Symptoms:**

- "OAuth app not found" errors
- Redirect URI mismatch errors
- Authentication flow fails

**Solutions:**

1. Verify OAuth app settings in GitHub:
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Check Authorization callback URL matches your `NEXTAUTH_URL`
   - For development: `http://localhost:3000/api/auth/callback/github`
   - For production: `https://yourdomain.com/api/auth/callback/github`

2. Update environment variables:

   ```bash
   # In .env
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   NEXTAUTH_URL=http://localhost:3000  # or your production URL
   ```

3. Generate a new NextAuth secret:

   ```bash
   openssl rand -base64 32
   ```

### Issue: Callback URL Mismatch

**Symptoms:**

- "redirect_uri_mismatch" error
- Authentication redirects to wrong URL

**Solutions:**

1. Ensure callback URLs match exactly:
   - GitHub OAuth app callback URL
   - `NEXTAUTH_URL` environment variable
   - No trailing slashes or extra paths

2. For local development, use:

   ```
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   NEXTAUTH_URL=http://localhost:3000
   ```

## Development Server Issues

### Issue: Port Already in Use

**Symptoms:**

- "Port 3000 is already in use" error
- Server fails to start

**Solutions:**

1. Kill the process using the port:

   ```bash
   # Find the process
   lsof -ti:3000

   # Kill the process
   kill -9 $(lsof -ti:3000)
   ```

2. Use a different port:

   ```bash
   npm run dev -- -p 3001
   ```

3. Check for other Next.js instances:

   ```bash
   ps aux | grep next
   ```

### Issue: Hot Reload Not Working

**Symptoms:**

- Changes not reflected in browser
- Need to manually refresh

**Solutions:**

1. Check file watching limits (Linux/macOS):

   ```bash
   # Increase file watch limit
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. Restart the development server:

   ```bash
   # Stop server (Ctrl+C) and restart
   npm run dev
   ```

3. Clear Next.js cache:

   ```bash
   rm -rf .next
   npm run dev
   ```

## Build and Deployment Issues

### Issue: Build Failures

**Symptoms:**

- TypeScript compilation errors
- Missing dependencies
- Build process hangs

**Solutions:**

1. Check TypeScript errors:

   ```bash
   npx tsc --noEmit
   ```

2. Clear build cache:

   ```bash
   rm -rf .next
   npm run build
   ```

3. Check for missing dependencies:

   ```bash
   npm install
   npm audit fix
   ```

### Issue: Vercel Deployment Failures

**Symptoms:**

- Build fails on Vercel
- Environment variables not working in production

**Solutions:**

1. Set environment variables in Vercel dashboard
2. Check build logs for specific errors
3. Ensure all dependencies are in `package.json` (not just `devDependencies`)
4. Verify Node.js version compatibility

## Database and API Issues

### Issue: API Routes Not Working

**Symptoms:**

- 404 errors on API endpoints
- API routes not found

**Solutions:**

1. Check file structure in `src/app/api/`
2. Ensure files are named `route.ts` (not `index.ts`)
3. Verify HTTP methods are exported correctly:

   ```typescript
   export async function GET(request: Request) {
     // Your code
   }
   ```

### Issue: CORS Errors

**Symptoms:**

- Cross-origin request blocked
- CORS policy errors in browser

**Solutions:**

1. Add CORS headers to API routes:

   ```typescript
   export async function GET(request: Request) {
     const response = new Response(data);
     response.headers.set('Access-Control-Allow-Origin', '*');
     return response;
   }
   ```

2. Use Next.js built-in CORS handling in `next.config.ts`

## Authentication Issues

### Issue: Session Not Persisting

**Symptoms:**

- User gets logged out on page refresh
- Session data not available

**Solutions:**

1. Check NextAuth configuration in `src/app/api/auth/[...nextauth]/route.ts`
2. Verify `NEXTAUTH_SECRET` is set
3. Check browser cookies are enabled
4. Clear browser storage and cookies

### Issue: JWT Token Errors

**Symptoms:**

- "Invalid token" errors
- Authentication randomly fails

**Solutions:**

1. Generate a new `NEXTAUTH_SECRET`:

   ```bash
   openssl rand -base64 32
   ```

2. Clear all sessions and cookies
3. Restart the application

## General Debugging Tips

### Enable Debug Logging

1. Set debug environment variables:

   ```bash
   # In .env
   NODE_ENV=development
   NEXTAUTH_DEBUG=true
   ```

2. Check browser console for errors
3. Check server logs in terminal

### Common Commands for Debugging

```bash
# Check environment variables
printenv | grep -E "(AIRTABLE|GITHUB|NEXTAUTH)"

# Test API endpoints
curl -X GET http://localhost:3000/api/users/test

# Check package versions
npm list

# Verify TypeScript compilation
npx tsc --noEmit

# Check linting issues
npm run lint

# Clear all caches
rm -rf .next node_modules package-lock.json
npm install
```

### Performance Debugging

1. Use Next.js built-in performance monitoring:

   ```bash
   npm run dev -- --turbo
   ```

2. Check bundle analyzer:

   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```

3. Monitor network requests in browser DevTools

### Getting Help

If you're still experiencing issues:

1. Check the [GitHub Issues](https://github.com/cuesoftinc/cuelabs-platform/issues) for similar problems
2. Create a new issue with:
   - Detailed error messages
   - Steps to reproduce
   - Environment information (OS, Node.js version, etc.)
   - Relevant configuration files (without sensitive data)

3. Join our community discussions for real-time help

### Environment Information Template

When reporting issues, include this information:

```bash
# System Information
echo "OS: $(uname -s)"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Next.js: $(npm list next --depth=0)"

# Project Information
echo "Environment: $NODE_ENV"
echo "Port: ${PORT:-3000}"

# Check critical files exist
ls -la .env 2>/dev/null && echo ".env exists" || echo ".env missing"
ls -la next.config.ts && echo "next.config.ts exists" || echo "next.config.ts missing"
```

Remember to never share sensitive information like API keys or secrets when reporting issues.
