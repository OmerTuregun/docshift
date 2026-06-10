"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ApiDocsPanel from "@/components/ApiDocsPanel";
import ApiGuidePicker, { type GuideTab } from "@/components/ApiGuidePicker";
import ApiKeysClient from "@/components/ApiKeysClient";
import type { ApiKey } from "@/lib/db/apiKeys";

interface HowUseClientProps {
  initialKeys: ApiKey[];
}

function hashToTab(hash: string): GuideTab | null {
  if (hash === "#rest" || hash === "#sdk") {
    return hash.slice(1) as GuideTab;
  }

  return null;
}

export default function HowUseClient({ initialKeys }: HowUseClientProps) {
  const [activeTab, setActiveTab] = useState<GuideTab | null>(null);
  const guideRef = useRef<HTMLDivElement>(null);

  const openGuide = useCallback((tab: GuideTab) => {
    setActiveTab(tab);
    window.history.replaceState(null, "", `#${tab}`);

    requestAnimationFrame(() => {
      guideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  useEffect(() => {
    const tab = hashToTab(window.location.hash);

    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  return (
    <>
      <ApiGuidePicker activeTab={activeTab} onSelect={openGuide} />

      <div ref={guideRef}>
        <ApiDocsPanel activeTab={activeTab} onTabChange={openGuide} />
      </div>

      <ApiKeysClient
        initialKeys={initialKeys}
        onShowGuide={openGuide}
      />
    </>
  );
}
