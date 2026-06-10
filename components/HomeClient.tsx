"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AnonBanner from "@/components/AnonBanner";
import CtaBand from "@/components/CtaBand";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import FileGrid from "@/components/FileGrid";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import JobResultList from "@/components/JobResultList";
import SectionDivider from "@/components/SectionDivider";
import StatsRow from "@/components/StatsRow";
import Toast from "@/components/Toast";
import WhyDocShift from "@/components/WhyDocShift";
import { useFileUpload } from "@/hooks/useFileUpload";

export default function HomeClient() {
  const { data: session } = useSession();
  const { jobs, addFiles, clearJobs, chainConvert } = useFileUpload();
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
        <StatsRow />
        <FileGrid user={session?.user ?? null} addFiles={addFiles} />
        <JobResultList
          jobs={jobs}
          clearJobs={clearJobs}
          onToast={showToast}
          chainConvert={chainConvert}
        />
        <AnonBanner />
        <SectionDivider />
        <HowItWorks />
        <WhyDocShift />
        <FaqSection />
        <CtaBand />
        <Footer />
        <Toast message={toastMessage} />
      </main>
    </div>
  );
}
