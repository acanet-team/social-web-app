import 'dotenv/config';

import { cookies } from 'next/headers';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';

import httpClient from '@/api';
import { removePropertiesEmpty } from '@/utils/Helpers';

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
    async jwt(params) {
      const data: { accessToken?: string; idToken?: string } = {};
      const { account, token } = params;
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
          url: 'login',
          data: removePropertiesEmpty(data),
        });
        cookies().set('acanet_token', res.token, {
          maxAge: res.tokenExpires,
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          domain: process.env.NEXT_PUBLIC_APP_URL,
          expires: new Date(res.tokenExpires),
        });
        return res;
      } catch (err) {
        console.log(err);
        return token;
      }
    },
    async session(params) {
      const { session, token } = params;
      Object.assign(session, token);
      return session;
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
