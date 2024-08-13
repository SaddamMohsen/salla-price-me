import { NextAuthOptions, getServerSession } from "next-auth";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/drizzle";
import "dotenv/config";
import { user as users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import SallaProvider from "@/lib/salla";

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: DrizzleAdapter(db, {
    usersTable: users
  }),
  secret: process.env.AUTH_SECRET,

  providers: [
    SallaProvider({
      clientId: process.env.AUTH_CLIENT_ID!,
      clientSecret: process.env.AUTH_CLIENT_SECRET!,

    })

  ],

  basePath: "/api/auth",
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, token, user }) {
      // console.log('in session', session);
      // console.log('in session token', token);
      // console.log('in session user', user);
      // do something to session
      if (token) {
        session.user.id = token.id;
        //session.user.username = token.username;
        session.user.email = token.email;
        session.user.name = token.name;
        //session.user.image = token.image as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      const email = token.email;
      console.log('in jwt callback', account);
      const dbUser = (
        await db
          .select()
          .from(users)
          .where(eq(users.email, email as string))
      )[0];

      if (!dbUser) {
        token.id = user.id;
        return token;
      }
      if (!dbUser.name) {
        await db
          .update(users)
          .set({ name: nanoid(10) })
          .where(eq(users.id, dbUser.id));
      }

      return {
        id: dbUser.id,
        // access_token: account?.access_token,
        // expire_at: account?.expires_at,
      };
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);


// import NextAuth, { type DefaultSession } from "next-auth";
// import type { NextAuthConfig, User } from "next-auth";
// import "next-auth/jwt";
// import SallaProvider from "./lib/salla";
// import { DrizzleAdapter } from "@auth/drizzle-adapter";
// import { db } from "@/db/drizzle";



// const config = {

//   adapter: DrizzleAdapter(db),
//   providers: [
//     SallaProvider({
//       clientId: process.env.AUTH_CLIENT_ID!,
//       clientSecret: process.env.AUTH_CLIENT_SECRET!,
//       // profile:async (profile: { id: any; name: any; email: any; picture: any; }, tokens: any): Promise<ExtendedUser | any> => {

//       //   console.log('profile', tokens);

//       //   return {
//       //     id: profile.id,
//       //     name: profile.name,
//       //     email: profile.email,
//       //     image: profile.picture,
//       //   };

//       //   console.log('error in get profile');

//       // },
//     })
//   ],
//   callbacks: {
//     // async signIn({ user, account }): Promise<User | any> {
//     //   console.log("signIn", user, account);
//     //   if (account?.provider === "salla") {
//     //     const { name, email } = user;
//     //     const payload = {
//     //       name,
//     //       email,

//     //       authType: "Oauth",
//     //     };
//     //     console.log(payload);
//     //     // const res = await oauthSignIn(payload);
//     //     // user.id = res.data._id.toString();
//     //     // user.isVerified = res.data.isVerified;
//     //     // user.image = res.data.avatar;

//     //     return user;
//     //   }
//     //   // Default to allow sign-in
//     //   return user;
//     // },
//     jwt({ token, trigger, session, account }) {
//       console.log("token in jwt",  account);
//       if (trigger === "update") token.name = session.user.name;
//       // if (account?.provider === "keycloak") {
//       //   return { ...token, accessToken: account.access_token };
//       // }
//       return token;
//     },
//     async session({ session, token }) {
//       console.log("in session ", session, token);
//       if (token?.access_token) {
//         session.access_token = token.access_token;
//       }
//       return session;
//     },
//   },
//   // experimental: {
//   //   enableWebAuthn: true,
//   // },
//   debug: process.env.NODE_ENV !== "production" ? true : false,
//   // pages: {
//   //   signIn: "/sign-in",
//   // },
//   session: {
//     strategy: "database",
//   },
//   basePath: "/api/auth",

// } satisfies NextAuthConfig;
// export const { handlers, signIn, signOut, auth } = NextAuth(config);
// type ExtendedUser = DefaultSession["user"] & {

//   //.$type<"admin" | "user">(),
//   createdAt: string
//   updatedAt: string
//   merchant: [Object]
//   //context: [Object]

// }
// declare module "next-auth" {
//   interface Session {
//     user: ExtendedUser;
//     access_token?: string;
//   }
//   interface ACCOUNT {
//     id: number;
//     access_token: string
//     expires_at: number
//     refresh_token: string
//   }



// }


// declare module "next-auth/jwt" {
//   interface JWT {
//     access_token: string
//     expires_at: number
//     refresh_token: string
//     scope: string
//     token_type: string

//   }
// }
