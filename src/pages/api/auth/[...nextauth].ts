import "dotenv/config";

import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

import httpClient from "@/api";
import { useAccessTokenStore } from "@/store/accessToken";
import { removePropertiesEmpty } from "@/utils/Helpers";
import type { NextAuthOptions } from "next-auth";

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
    async jwt({ token, account }) {
      if (account?.provider === "facebook") {
        token.access_token = account.access_token;
        token.provider = "facebook";
      }
      if (account?.provider === "google") {
        token.idToken = account.id_token;
        token.provider = "google";
      }

      return token;
    },

    async session({ session, token, ...d }: any) {
      // const accessToken = useAccessTokenStore.getState().accessToken;
      // if (accessToken) {
      //   return session;
      // }

      if ((token?.access_token || token.idToken) && !session.user?.id) {
        const data: { accessToken?: string; idToken?: string } = {};

        if (token?.provider === "google") {
          data.idToken = token.idToken;
        }
        if (token?.provider === "facebook") {
          data.accessToken = token.access_token;
        }

        try {
          const res = await httpClient.post<any, any>(
            `/v1/auth/${token?.provider}/login`,
            removePropertiesEmpty(data),
          );

          useAccessTokenStore.setState({
            accessToken: res.data.token,
            refreshTokenExpires: res.data.refreshTokenExpires,
            tokenExpires: res.data.tokenExpires,
            refreshToken: res.data.refreshToken,
          });

          session.user = {
            ...res.data.user,
            isBroker: res.data.isBroker,
            isProfile: res.data.isProfile,
          };
          session.token = res.data.token;
          return session;
        } catch (err) {
          console.log("err", err);
          return session;
        }
      } else {
        return session;
      }
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/sign-out",
    error: "/error",
  },
};

export default NextAuth(options);
