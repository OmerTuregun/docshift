"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import FileGrid from "@/components/FileGrid";
import ResultPanel, { type ResultPanelData } from "@/components/ResultPanel";
import Toast from "@/components/Toast";
import type { Session } from "next-auth";

interface HomeClientProps {
  user: Session["user"] | null;
}

export default function HomeClient({ user }: HomeClientProps) {
  const [activeResult, setActiveResult] = useState<ResultPanelData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;

    const timer = window.setTimeout(() => {
      setToastMessage(null);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-8">
      <h1 className="mb-12 text-4xl font-bold text-[#1D3461]">DocShift</h1>
      <FileGrid user={user} onResult={setActiveResult} onToast={showToast} />

      {!user ? (
        <p className="mt-8 text-center text-sm text-gray-600">
          Geçmişinizi kaydetmek için{" "}
          <Link
            href="/auth/login"
            className="font-medium text-[#1A9BA1] underline underline-offset-2"
          >
            Giriş yapın
          </Link>
        </p>
      ) : null}

      <ResultPanel
        data={activeResult}
        onClose={() => setActiveResult(null)}
        onToast={showToast}
      />
      <Toast message={toastMessage} />
    </main>
  );
}
