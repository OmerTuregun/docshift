"use client";

import { useCallback, useEffect, useState } from "react";
import {
  STATS_UPDATED_EVENT,
  getSessionCount,
} from "@/lib/sessionStats";

const STATS = [
  {
    label: "Bu oturumda",
    valueKey: "session" as const,
    sub: "dönüşüm yapıldı",
  },
  {
    label: "Toplam kullanıcı",
    valueKey: "users" as const,
    sub: "aktif üye",
  },
  {
    label: "Bugün işlenen",
    valueKey: "files" as const,
    sub: "dosya dönüşümü",
  },
];

export default function StatsRow() {
  const [sessionCount, setSessionCount] = useState(0);

  const refreshCount = useCallback(() => {
    setSessionCount(getSessionCount());
  }, []);

  useEffect(() => {
    refreshCount();

    const handleStatsUpdated = () => refreshCount();
    window.addEventListener(STATS_UPDATED_EVENT, handleStatsUpdated);

    return () =>
      window.removeEventListener(STATS_UPDATED_EVENT, handleStatsUpdated);
  }, [refreshCount]);

  const values = {
    session: String(sessionCount),
    users: "12.4k",
    files: "8.1k",
  };

  return (
    <div className="mx-auto mb-10 grid max-w-4xl grid-cols-1 gap-4 px-6 sm:grid-cols-3">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-gray-100 bg-gray-50 p-4"
        >
          <p className="mb-1 text-xs text-gray-400">{stat.label}</p>
          <p className="text-2xl font-semibold text-brand-navy">
            {values[stat.valueKey]}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}
