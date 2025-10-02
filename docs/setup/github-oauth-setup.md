# GitHub OAuth Setup Guide

This guide will walk you through setting up GitHub OAuth authentication for the CueLABS™ platform. GitHub OAuth allows users to sign in using their GitHub accounts and enables integration with GitHub repositories for bounty submissions.

## Prerequisites

- A GitHub account
- Administrative access to create OAuth applications
- Basic understanding of OAuth 2.0 flow

## Step 1: Create a GitHub OAuth Application

1. **Navigate to GitHub Settings**
   - Go to [GitHub.com](https://github.com)
   - Click your profile picture in the top-right corner
   - Select "Settings" from the dropdown menu

2. **Access Developer Settings**
   - Scroll down in the left sidebar
   - Click "Developer settings" at the bottom

3. **Create New OAuth App**
   - Click "OAuth Apps" in the left sidebar
   - Click "New OAuth App" button

## Step 2: Configure OAuth Application Settings

Fill out the OAuth application form with the following information:

### Application Details

| Field | Value | Description |
|-------|-------|-------------|
| **Application name** | `CueLABS™ Platform (Development)` | Descriptive name for your app |
| **Homepage URL** | `http://localhost:3000` | Your local development URL |
| **Application description** | `Developer platform for AI innovation and bounty management` | Brief description of your application |
| **Authorization callback URL** | `http://localhost:3000/api/auth/callback/github` | NextAuth.js callback endpoint |

### Important Notes

- **For Development**: Use `http://localhost:3000` as your homepage URL
- **For Production**: You'll need to create a separate OAuth app with your production domain
- **Callback URL**: Must match exactly - NextAuth.js uses `/api/auth/callback/github` by default

## Step 3: Register the Application

1. Review your settings carefully
2. Click "Register application"
3. You'll be redirected to your new OAuth app's settings page

## Step 4: Get Your OAuth Credentials

After creating the application, you'll see:

### Client ID

- This is visible immediately after creation
- Copy this value - you'll need it for your environment variables
- Example format: `Iv1.a1b2c3d4e5f6g7h8`

### Client Secret

1. Click "Generate a new client secret"
2. **Important**: Copy this value immediately - you won't be able to see it again
3. Store it securely - treat it like a password
4. Example format: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0`

## Step 5: Configure Environment Variables

Add these variables to your `.env.local` file:

```env
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### Generating NEXTAUTH_SECRET

You can generate a secure secret using one of these methods:

**Method 1: Using OpenSSL (recommended)**

```bash
openssl rand -base64 32
```

**Method 2: Using Node.js**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Method 3: Online Generator**

- Visit [generate-secret.vercel.app](https://generate-secret.vercel.app/32)
- Copy the generated secret

## Step 6: Production Setup

For production deployment, you'll need to create a separate OAuth application:

### Production OAuth App Settings

| Field | Value | Description |
|-------|-------|-------------|
| **Application name** | `CueLABS™ Platform (Production)` | Production app name |
| **Homepage URL** | `https://your-domain.com` | Your production domain |
| **Authorization callback URL** | `https://your-domain.com/api/auth/callback/github` | Production callback URL |

### Production Environment Variables

```env
# Production GitHub OAuth
GITHUB_CLIENT_ID=your_production_client_id
GITHUB_CLIENT_SECRET=your_production_client_secret

# Production NextAuth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_production_secret
```

## Step 7: Verify OAuth Configuration

### Check NextAuth Configuration

Ensure your `src/app/api/auth/[...nextauth]/route.ts` includes GitHub provider:

```typescript
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    })
  ],
  // Additional configuration...
})

export { handler as GET, handler as POST }
```

### Test the OAuth Flow

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Click the "Sign in with GitHub" button

4. You should be redirected to GitHub's authorization page

5. After authorizing, you should be redirected back to your application

## Troubleshooting

### Common Issues and Solutions

#### Error: "The redirect_uri MUST match the registered callback URL for this application"

**Cause**: Callback URL mismatch between your OAuth app settings and your application

**Solutions**:

- Verify the callback URL in your GitHub OAuth app settings
- Ensure it matches: `http://localhost:3000/api/auth/callback/github`
- Check for typos, extra slashes, or incorrect protocol (http vs https)
- Restart your development server after making changes

#### Error: "Client authentication failed"

**Cause**: Invalid client ID or client secret

**Solutions**:

- Verify your `GITHUB_CLIENT_ID` is correct
- Regenerate your client secret if needed
- Ensure no extra spaces or characters in your environment variables
- Check that your `.env.local` file is in the project root

#### Error: "Application suspended"

**Cause**: GitHub has suspended your OAuth application

**Solutions**:

- Check your GitHub notifications for suspension reasons
- Review GitHub's OAuth app policies
- Contact GitHub support if needed
- Create a new OAuth application if necessary

#### Error: "Rate limit exceeded"

**Cause**: Too many OAuth requests in a short period

**Solutions**:

- Wait for the rate limit to reset (usually 1 hour)
- Implement proper error handling in your application
- Consider caching user sessions to reduce OAuth calls

#### Error: "Invalid state parameter"

**Cause**: CSRF protection failure or session issues

**Solutions**:

- Clear your browser cookies and local storage
- Ensure `NEXTAUTH_SECRET` is properly set
- Restart your development server
- Check for browser extensions that might interfere

### Development vs Production Issues

#### Different Domains

- Development uses `localhost:3000`
- Production uses your actual domain
- You need separate OAuth apps for each environment

#### HTTPS Requirements

- Production OAuth apps require HTTPS
- Development can use HTTP
- Ensure your production deployment uses SSL/TLS

#### Environment Variable Management

- Use different `.env` files for different environments
- Never commit secrets to version control
- Use your deployment platform's environment variable settings

### Testing OAuth Integration

#### Manual Testing Checklist

1. **Sign In Flow**
   - [ ] Click "Sign in with GitHub" redirects to GitHub
   - [ ] GitHub authorization page displays correctly
   - [ ] After authorization, redirected back to your app
   - [ ] User session is created successfully

2. **User Data**
   - [ ] GitHub username is captured
   - [ ] Email address is available (if public)
   - [ ] Profile information is stored correctly

3. **Session Management**
   - [ ] User stays logged in across page refreshes
   - [ ] Sign out functionality works
   - [ ] Session expires appropriately

#### Automated Testing

Consider adding tests for OAuth flow:

```typescript
// Example test structure
describe('GitHub OAuth', () => {
  it('should redirect to GitHub for authentication', () => {
    // Test implementation
  })

  it('should handle successful callback', () => {
    // Test implementation
  })

  it('should handle OAuth errors gracefully', () => {
    // Test implementation
  })
})
```

## Security Best Practices

### Environment Variables

- Never commit OAuth secrets to version control
- Use different secrets for development and production
- Rotate secrets regularly
- Use your deployment platform's secure environment variable storage

### Application Security

- Always use HTTPS in production
- Implement proper CSRF protection (NextAuth handles this)
- Validate and sanitize user data from GitHub
- Implement proper session management

### OAuth App Management

- Regularly review authorized applications
- Monitor OAuth app usage and logs
- Keep OAuth app information up to date
- Remove unused OAuth applications

## Advanced Configuration

### Custom Scopes

If you need additional GitHub permissions, you can request specific scopes:

```typescript
GitHubProvider({
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  authorization: {
    params: {
      scope: "read:user user:email repo"
    }
  }
})
```

Common scopes:

- `read:user` - Read user profile information
- `user:email` - Access user email addresses
- `repo` - Access repositories (for bounty submissions)
- `read:org` - Read organization membership

### Custom Callback Handling

For advanced use cases, you can customize the callback:

```typescript
callbacks: {
  async signIn({ user, account, profile }) {
    // Custom sign-in logic
    return true
  },
  async session({ session, token }) {
    // Add custom data to session
    return session
  }
}
```

## Next Steps

After completing the GitHub OAuth setup:

1. Test the authentication flow thoroughly
2. Set up your Airtable integration (see [Airtable Setup Guide](./airtable-setup.md))
3. Configure all environment variables (see [Environment Configuration Guide](./environment-setup.md))
4. Deploy to your production environment

## Additional Resources

- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [NextAuth.js GitHub Provider](https://next-auth.js.org/providers/github)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
