import 'dotenv/config';

import { cookies } from 'next/headers';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

import httpClient from '@/api';
import { removePropertiesEmpty } from '@/utils/Helpers';
import { getMe } from '@/api/auth';
import { User } from '@clerk/nextjs/server';

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async signIn({ account }) {
      const data: { accessToken?: string; idToken?: string } = {};

      if (account?.provider === 'google') {
        data.idToken = account.id_token;
      }
      if (account?.provider === 'facebook') {
        data.accessToken = account.access_token;
      }

      try {
        const res = await httpClient.post<{
          token: string;
          tokenExpires: number;
        }>({
          url: `/v1/auth/${account?.provider}/login`,
          data: removePropertiesEmpty(data),
        });

        cookies().set('accessToken', res.token, {
          path: '/', // Set path to '/' to send cookie in all requests
          maxAge: 30 * 24 * 60 * 60, // 30 days
          // domain: process.env.NEXT_PUBLIC_API_DOMAIN,
          httpOnly: false,
          secure: false,
        });

        return true;
      } catch (err) {
        return false;
      }
    },
  },

  pages: {
    signIn: '/sign-in',
    signOut: '/sign-out',
    error: '/error',
  },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
