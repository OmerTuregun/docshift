import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { isGoogleAuthConfigured } from "@/lib/auth-config";
import pool from "@/lib/db/pool";

const googleClientId = process.env.AUTH_GOOGLE_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET;

if (!isGoogleAuthConfigured()) {
  console.warn(
    "[auth] Google OAuth yapılandırılmadı. .env.local dosyasına AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET ve AUTH_SECRET ekleyin.",
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: "database" },
  providers: [
    Google({
      clientId: googleClientId ?? "",
      clientSecret: googleClientSecret ?? "",
    }),
  ],
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
