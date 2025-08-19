/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import AppleProvider from 'next-auth/providers/apple';
import { airtableClient } from '@/lib/airtable';

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
    async signIn({ user, account, profile }) {
      try {
        // Check if user exists in Airtable
        const existingUsers = await airtableClient.getRecords('Users', {
          filterByFormula: `{Email} = "${user.email}"`,
        });

        if (existingUsers.records.length === 0) {
          // Create new user in Airtable
          await airtableClient.createRecord('Users', {
            Email: user.email,
            Name: user.name || '',
            Avatar: user.image || '',
            Provider: account?.provider || '',
            'Provider ID': account?.providerAccountId || '',
            'Created At': new Date().toISOString(),
            Status: 'Active',
          });
        } else {
          // Update existing user's last login
          const existingUser = existingUsers.records[0];
          await airtableClient.updateRecord('Users', existingUser.id, {
            'Last Login': new Date().toISOString(),
            Avatar: user.image || existingUser.fields.Avatar,
          });
        }

        return true;
      } catch (error) {
        console.error('Error during sign in:', error);
        return false;
      }
    },
    async session({ session, token }) {
      // Fetch user data from Airtable
      try {
        const users = await airtableClient.getRecords('Users', {
          filterByFormula: `{Email} = "${session.user?.email}"`,
        });

        if (users.records.length > 0) {
          const userData = users.records[0].fields;
          session.user = {
            ...session.user,
            // id: users.records[0].id,
            // role: userData.Role || 'user',
            // status: userData.Status || 'Active',
          };
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }

      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
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
