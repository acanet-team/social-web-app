import "dotenv/config";

import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

import httpClient from "@/api";
import { refreshToken } from "@/api/auth";
import { removePropertiesEmpty } from "@/utils/Helpers";
import type { NextAuthOptions } from "next-auth";
import { setCookie } from "nookies";

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async jwt({ token, account }: any) {
      if (token.accessToken || !account) {
        token.needToLogin = false;
        const shouldRefreshTime =
          token.tokenExpires - 2 * 60 * 1000 < Date.now();
        if (token.refreshTokenExpires < Date.now()) {
          token.needToLogin = true;
          return token;
        }
        if (shouldRefreshTime) {
          const res = await refreshToken(token.refreshToken);
          token.accessToken = res.token;
          token.refreshTokenExpires = res.refreshTokenExpires;
          token.tokenExpires = res.tokenExpires;
          token.refreshToken = res.refreshToken;
          return token;
        }
        return token;
      }
      const data: { accessToken?: string; idToken?: string } = {};
      if (account?.provider === "google") {
        data.idToken = account.id_token;
        token.provider = "google";
      }
      if (account?.provider === "facebook") {
        data.accessToken = account.access_token;
        token.provider = "facebook";
      }

      const res = await httpClient.post<any, any>(
        `/v1/auth/${token?.provider}/login`,
        removePropertiesEmpty(data),
      );

      token.user = {
        ...res.data.user,
        isBroker: res.data.isBroker,
        isProfile: res.data.isProfile,
      };
      token.accessToken = res.data.token;
      token.refreshTokenExpires = res.data.refreshTokenExpires;
      token.tokenExpires = res.data.tokenExpires;
      token.refreshToken = res.data.refreshToken;
      return token;
    },

    async session({ session, token }: any) {
      session = { ...session, ...token };
      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/sign-out",
    error: "/error",
  },
};

export default NextAuth(options);
