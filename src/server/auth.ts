import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  User,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "~/env";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";
import { type Clubs } from "@prisma/client";
import { decode, encode } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */


declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      interestedIn: Clubs[];
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    interestedIn: Clubs[];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}

export const authOptions: NextAuthOptions = {
  // Existing configuration
  providers: [
    // Add a credentials provider
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Here you need to authenticate the user with your own logic
        // Fetch user from the database, for example:
        const user = await db.user.findUnique({
          where: { email: credentials?.email },
          include: {
            interestedIn: true,
          }
        });

        if (user && user.password === credentials?.password) {
          console.log('------------------- user -------------------');
          console.log(user);
          // Any user object returned here will be saved in the session
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            interestedIn: user.interestedIn,
          } as User
        } else {
          // Returning null or false will fail the authentication
          return null;
        }
      },
    }),
    // Additional providers as needed
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: env.NEXTAUTH_SECRET,
    encode: encode,
    decode: decode,
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('------------------- jwt -------------------');
      console.log("token", token);
      console.log("user", user);
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('------------------- session -------------------');
      console.log("session", session);
      session.user = { ...session.user, ...token.user };
      console.log("modified session", session);
      return session;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin",
    newUser: "/auth/signup",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
