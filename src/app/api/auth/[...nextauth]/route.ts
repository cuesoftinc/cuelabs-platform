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
  callbacks: {
    async signIn({ user }) {
      try {
        // Check if user exists in Airtable
        const existingUsers = await airtableClient.getRecords('Users', {
          filterByFormula: `{Email} = "${user.email}"`,
        });

        if (existingUsers.records.length === 0) {
          // Create new user in Airtable
          const newUser = await airtableClient.createRecord('Users', {
            Email: user.email,
            Name: user.name || '',
            Status: 'Active',
            'Wallet Balance': 0,
            'Total Earnings': 0,
          });
          
          // Store the new user ID for later use
          user.id = newUser.id;
        } else {
          // Update existing user's last login
          const existingUser = existingUsers.records[0];
          
          // Store the existing user ID
          user.id = existingUser.id;
        }

        return true;
      } catch (error) {
        console.error('Error during sign in:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        // Store the Airtable user ID in the token
        token.airtableUserId = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the Airtable user ID to the session
      if (token.airtableUserId && session.user) {
        session.user.id = token.airtableUserId;
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
});

export { handler as GET, handler as POST };
