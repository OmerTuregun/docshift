import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { pool } from "@/lib/db/pool";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [Google],
  trustHost: true,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = String(user.id);
      }

      return session;
    },
  },
});
