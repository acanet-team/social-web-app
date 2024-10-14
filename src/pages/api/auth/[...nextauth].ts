import "dotenv/config";
import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import httpClient from "@/api";
import { getMe, guestLogin, refreshToken } from "@/api/auth";
import { removePropertiesEmpty } from "@/utils/Helpers";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { randomUUID } from "crypto";
import { objectToAuthDataMap, AuthDataValidator } from "@telegram-auth/server";
import console from "console";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "guest",
      credentials: {},
      async authorize(credentials, req): Promise<any> {
        console.log("credentials", credentials);
        // generate a random name and email for this anonymous user
        const unique_uuid: string = randomUUID();
        // return true
        return {
          id: unique_uuid,
          email: `${unique_uuid.toLowerCase()}@example.com`,
          name: unique_uuid,
          image: "",
        };
      },
    }),
    CredentialsProvider({
      id: "telegram-login",
      name: "Telegram Login",
      credentials: {},
      async authorize(credentials, req) {
        const validator = new AuthDataValidator({
          botToken: `${process.env.NEXT_PUBLIC_BOT_TOKEN}`,
        });
        const data = objectToAuthDataMap(req.query || {});
        const user = await validator.validate(data);
        if (user.id && user.first_name) {
          const returned = {
            id: user.id.toString(),
            email: user.id.toString(),
            name: [user.first_name, user.last_name || ""].join(" "),
            image: user.photo_url,
            ...req.query,
          };
          return returned;
        }
        return null;
      },
    }),
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
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, trigger, user }: any) {
      if (account?.provider === "credentials") {
        const guestTokenRes: any = await guestLogin();
        const guestToken = guestTokenRes.token;
        token.accessToken = guestToken;
        token.needToLogin = false;
        httpClient.setAuthorization(guestToken);
        const userData = await getMe();
        token.user = {
          ...userData.user,
          ...userData,
        };
        if (token.refreshTokenExpires < Date.now()) {
          token.needToLogin = true;
          return token;
        }
        return token;
      }

      if (trigger === "update") {
        httpClient.setAuthorization(token.accessToken);
        const userData = await getMe();
        token.user = {
          ...token.user,
          ...userData,
          ...userData.user,
        };
        return token;
      }

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
      if (account?.provider === "telegram-login") {
        Object.assign(data, user);
        token.provider = "telegram";
      }
      const res = await httpClient.post<any, any>(
        `/v1/auth/${token?.provider}/login`,
        removePropertiesEmpty(data),
      );
      httpClient.setAuthorization(res.data.token);
      const userData = await getMe();

      token.user = {
        ...res.data.user,
        ...userData.user,
        ...userData,
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
