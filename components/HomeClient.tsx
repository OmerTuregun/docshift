"use client";

import { useCallback, useEffect, useState } from "react";
import AnonBanner from "@/components/AnonBanner";
import FileGrid from "@/components/FileGrid";
import HeroSection from "@/components/HeroSection";
import ResultPanel, { type ResultPanelData } from "@/components/ResultPanel";
import StatsRow from "@/components/StatsRow";
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
    <main className="min-h-screen bg-white">
      <HeroSection />
      <FileGrid user={user} onResult={setActiveResult} onToast={showToast} />
      <AnonBanner isLoggedIn={Boolean(user)} />
      <StatsRow />
      <ResultPanel
        data={activeResult}
        onClose={() => setActiveResult(null)}
        onToast={showToast}
      />
      <Toast message={toastMessage} />
    </main>
  );
}
