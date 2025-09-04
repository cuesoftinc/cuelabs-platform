/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import AppleProvider from 'next-auth/providers/apple';
import { airtableClient } from '@/lib/airtable';

// Extend the NextAuth types to include our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
  
  interface User {
    id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    airtableUserId?: string;
  }
}

console.log('🚀 NextAuth configuration loading...');
console.log('🔑 GitHub Client ID:', process.env.GITHUB_CLIENT_ID ? 'Set' : 'Missing');
console.log('🔐 GitHub Client Secret:', process.env.GITHUB_CLIENT_SECRET ? 'Set' : 'Missing');
console.log('🌐 NextAuth URL:', process.env.NEXTAUTH_URL);
console.log('🔒 NextAuth Secret:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing');

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'name email',
          response_mode: 'form_post',
        },
      },
    }),
  ],
  events: {
    async signIn(message) {
      console.log('🎉 SignIn event triggered:', message);
    },
    async signOut(message) {
      console.log('👋 SignOut event triggered:', message);
    },
    async createUser(message) {
      console.log('👤 CreateUser event triggered:', message);
    },
    async session(message) {
      console.log('📱 Session event triggered:', message);
    },
    async error(message) {
      console.error('❌ NextAuth Error event:', message);
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 NextAuth signIn callback triggered');
      console.log('User:', { email: user.email, name: user.name, provider: account?.provider });
      
      try {
        // Check if user exists in Airtable
        console.log('🔍 Checking if user exists in Airtable...');
        const existingUsers = await airtableClient.getRecords('Users', {
          filterByFormula: `{Email} = "${user.email}"`,
        });

        console.log('📊 Airtable response:', existingUsers.records.length, 'users found');

        if (existingUsers.records.length === 0) {
          // Create new user in Airtable
          console.log('➕ Creating new user in Airtable...');
          // Try with minimal fields first to avoid 422 error
          const newUser = await airtableClient.createRecord('Users', {
            Email: user.email,
            Name: user.name || '',
            // Avatar: user.image || '',
            // Provider: account?.provider || '',
            // 'Provider ID': account?.providerAccountId || '',
            Status: 'Active',
            'Wallet Balance': 0,
            'Total Earnings': 0,
          });
          
          console.log('✅ New user created:', newUser.id);
          // Store the new user ID for later use
          user.id = newUser.id;
        } else {
          // Update existing user's last login
          console.log('🔄 Updating existing user...');
          const existingUser = existingUsers.records[0];
          // await airtableClient.updateRecord('Users', existingUser.id, {
          //   'Last Login': new Date().toISOString(),
          //   Avatar: user.image || existingUser.fields.Avatar,
          // });
          
          console.log('✅ Existing user updated:', existingUser.id);
          // Store the existing user ID
          user.id = existingUser.id;
        }

        console.log('🎉 SignIn successful, returning true');
        return true;
      } catch (error) {
        console.error('❌ Error during sign in:', error);
        console.error('❌ Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          user: { email: user.email, name: user.name }
        });
        return false;
      }
    },
    async jwt({ token, user, account }) {
      console.log('🔑 JWT callback triggered');
      if (user) {
        // Store the Airtable user ID in the token
        token.airtableUserId = user.id;
        token.email = user.email;
        console.log('🔑 JWT token updated with Airtable user ID:', user.id);
      }
      return token;
    },
    async session({ session, token }) {
      console.log('📱 Session callback triggered');
      // Pass the Airtable user ID to the session
      if (token.airtableUserId && session.user) {
        session.user.id = token.airtableUserId;
        console.log('📱 Session updated with Airtable user ID:', token.airtableUserId);
      }
      return session;
    },
  },
  pages: {
    signIn: '/platform/auth/login',
    error: '/platform/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  debug: true, // Enable debug mode to see more detailed logs
});

console.log('✅ NextAuth configuration loaded successfully');

export { handler as GET, handler as POST };
