"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import MergeAnonHistory from "@/components/MergeAnonHistory";
import Toast from "@/components/Toast";

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <MergeAnonHistory />
      {children}
      <Toast />
    </SessionProvider>
  );
}
