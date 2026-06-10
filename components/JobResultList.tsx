"use client";

import JobResultCard from "@/components/JobResultCard";
import type { UploadJob } from "@/types";

interface JobResultListProps {
  jobs: UploadJob[];
  clearJobs: () => void;
  onToast: (message: string) => void;
}

export default function JobResultList({
  jobs,
  clearJobs,
  onToast,
}: JobResultListProps) {
  if (jobs.length === 0) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 max-h-[50vh] overflow-y-auto border-t border-white/10 bg-[#0f172a]">
      <div className="flex items-center justify-between px-5 pt-3">
        <p className="text-sm text-white/70">Dönüşüm Sonuçları</p>
        <button
          type="button"
          onClick={clearJobs}
          className="text-xs text-white/50 transition-colors hover:text-white/80"
        >
          Tümünü Kapat
        </button>
      </div>

      <div className="pb-3">
        {jobs.map((job) => (
          <JobResultCard key={job.id} job={job} onToast={onToast} />
        ))}
      </div>
    </div>
  );
}
