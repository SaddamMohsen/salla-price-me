import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import "next-auth/jwt";

const config = {

  providers: [
    {
      id: "salla",
      name: "Salla",
      type: "oauth",
      //type: "oidc",
      checks: ["state"],

      authorization:
      {
        url: "https://accounts.salla.sa/oauth2/auth",
        params: {
          grant_type: "authorization_code",
          response_type: "token",
          scope: "offline_access",
          client_id: process.env.AUTH_CLIENT_ID,
          client_secret: process.env.AUTH_CLIENT_SECRET,
          //code: "",
          redirect_uri: "http://localhost:3000/api/auth/callback/salla",
        },
      },
      // {
      //   url:"https://accounts.salla.sa/oauth2/auth",
      //   params:{

      //   }
      // },
      token: {
        url: "https://accounts.salla.sa/oauth2/token",
        method: "POST",
        params: {
          grant_type: "authorization_code",
          //response_type: "token",
          scope: "offline_access",
          //state: '',
          client_id: process.env.AUTH_CLIENT_ID,
          client_secret: process.env.AUTH_CLIENT_SECRET,
          code: "",
          redirect_uri: "http://localhost:3000/api/auth/callback/salla",
        },
      },
      userinfo: "https://accounts.salla.sa/oauth2/user/info",
      async profile(profile) {
        console.log("profile", profile);
        return {
          id: profile.sub
          // name: profile.user.name,
          // email: profile.user.email,
        };
      },

      clientId: process.env.AUTH_CLIENT_ID, // from the provider's dashboard
      clientSecret: process.env.AUTH_CLIENT_SECRET, // from the provider's dashboard
      //redirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL,

    }],
  callbacks: {
    jwt({ token, trigger, session, account }) {
      console.log("token in jwt", token, session, account);
      if (trigger === "update") token.name = session.user.name;
      // if (account?.provider === "keycloak") {
      //   return { ...token, accessToken: account.access_token };
      // }
      return token;
    },
    async session({ session, token }) {
      console.log("in session ", session, token);
      if (token?.access_token) {
        session.access_token = token.access_token;
      }
      return session;
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
  session: {
    strategy: "jwt",

  },
  basePath: "/api/auth",

} satisfies NextAuthConfig;
export const { handlers, signIn, signOut, auth } = NextAuth(config);

declare module "next-auth" {
  interface Session {
    access_token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string
    expires_at: number
    refresh_token: string
    scope: string
    token_type: string

  }
}