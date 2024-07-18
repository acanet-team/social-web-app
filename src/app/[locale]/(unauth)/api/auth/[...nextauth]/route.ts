import 'dotenv/config';

import { cookies } from 'next/headers';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';

import { request } from '@/utils/api/axios';
import API_URL from '@/utils/api/url';
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
        const res = await request({
          method: 'POST',
          url: `${API_URL.AUTH}/${account?.provider}/login`,
          data: removePropertiesEmpty(data),
        });
        cookies().set('acanet_token', res.data.token, {
          maxAge: res.data.tokenExpires,
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          domain: process.env.NEXT_PUBLIC_APP_URL,
          expires: new Date(res.data.tokenExpires),
        });
        return res.data;
      } catch (err) {
        // console.log(err);
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
    signIn: '/account',
    signOut: '/sign-out',
    error: '/error',
  },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
