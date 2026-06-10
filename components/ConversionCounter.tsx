"use client";

import { useEffect, useState } from "react";

export default function ConversionCounter() {
  const [totalConversions, setTotalConversions] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) return;

        const data = (await response.json()) as { totalConversions: number };
        setTotalConversions(data.totalConversions);
      } catch {
        setTotalConversions(null);
      }
    };

    void fetchStats();

    const handleStatsRefresh = () => {
      void fetchStats();
    };

    window.addEventListener("stats:updated", handleStatsRefresh);

    return () => window.removeEventListener("stats:updated", handleStatsRefresh);
  }, []);

  return (
    <div className="mx-auto mb-8 max-w-xs rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="mb-1 text-xs text-gray-400">Toplam dönüşüm</p>
      <p className="text-2xl font-semibold text-brand-navy">
        {totalConversions !== null
          ? totalConversions.toLocaleString("tr-TR")
          : "—"}
      </p>
      <p className="mt-0.5 text-xs text-gray-400">
        anonim dahil tüm dönüşümler
      </p>
    </div>
  );
}
