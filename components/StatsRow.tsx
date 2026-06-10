"use client";

import { useEffect, useState } from "react";
import { TbChartBar, TbFiles, TbRefresh } from "react-icons/tb";
import { CONVERSION_DONE_EVENT, getSessionCount } from "@/lib/sessionCount";

interface StatCardProps {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  sub: string;
}

function StatCard({ icon, value, label, sub }: StatCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3 sm:p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d0f0f2]">
        {icon}
      </div>
      <div>
        <div className="text-xl font-medium text-[#1D3461] sm:text-2xl">{value}</div>
        <div className="mt-0.5 text-xs text-gray-400">{label}</div>
        <div className="mt-0.5 text-[10px] text-gray-300">{sub}</div>
      </div>
    </div>
  );
}

export default function StatsRow() {
  const [totalConversions, setTotalConversions] = useState<number | null>(null);
  const [sessionCount, setSessionCount] = useState(0);

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

  useEffect(() => {
    setSessionCount(getSessionCount());

    const handleConversionDone = () => {
      setSessionCount(getSessionCount());
    };

    window.addEventListener(CONVERSION_DONE_EVENT, handleConversionDone);
    return () =>
      window.removeEventListener(CONVERSION_DONE_EVENT, handleConversionDone);
  }, []);

  return (
    <div className="mx-auto mb-6 max-w-4xl px-4 sm:px-6">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={<TbChartBar className="text-base text-[#1A9BA1]" />}
          value={
            totalConversions === null ? (
              <div className="h-7 w-20 animate-pulse rounded bg-gray-100" />
            ) : (
              totalConversions.toLocaleString("tr-TR")
            )
          }
          label="Toplam dönüşüm"
          sub="anonim dahil"
        />

        <StatCard
          icon={<TbFiles className="text-base text-[#1A9BA1]" />}
          value="4"
          label="Dosya formatı"
          sub="Excel · Word · PDF · PPT"
        />

        <StatCard
          icon={<TbRefresh className="text-base text-[#1A9BA1]" />}
          value={sessionCount.toLocaleString("tr-TR")}
          label="Bu oturumda"
          sub="dönüşüm yaptınız"
        />
      </div>
    </div>
  );
}
