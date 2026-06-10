"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AnonBanner from "@/components/AnonBanner";
import ConversionCounter from "@/components/ConversionCounter";
import FileGrid from "@/components/FileGrid";
import HeroSection from "@/components/HeroSection";
import JobResultList from "@/components/JobResultList";
import Toast from "@/components/Toast";
import { useFileUpload } from "@/hooks/useFileUpload";

export default function HomeClient() {
  const { data: session } = useSession();
  const { jobs, addFiles, clearJobs } = useFileUpload();
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
    <div className="min-h-screen bg-white px-4 sm:px-0">
      <main className="w-full">
        <HeroSection />
        <FileGrid user={session?.user ?? null} addFiles={addFiles} />
        <AnonBanner isLoggedIn={Boolean(session?.user)} />
        <ConversionCounter />
        <JobResultList jobs={jobs} clearJobs={clearJobs} onToast={showToast} />
        <Toast message={toastMessage} />
      </main>
    </div>
  );
}
