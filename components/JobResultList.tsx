"use client";

import { useState } from "react";
import { TbFileZip, TbLoader2 } from "react-icons/tb";
import JobResultCard from "@/components/JobResultCard";
import type { OutputFormat } from "@/lib/converters";
import type { UploadJob } from "@/types";

interface JobResultListProps {
  jobs: UploadJob[];
  clearJobs: () => void;
  chainConvert: (job: UploadJob, toFormat: OutputFormat) => Promise<void>;
  retryJob: (job: UploadJob) => void;
  onDownloadAll: () => Promise<void>;
  hasMultipleSuccessful: boolean;
}

export default function JobResultList({
  jobs,
  clearJobs,
  chainConvert,
  retryJob,
  onDownloadAll,
  hasMultipleSuccessful,
}: JobResultListProps) {
  const [isZipping, setIsZipping] = useState(false);

  if (jobs.length === 0) return null;

  const handleDownloadAll = async () => {
    setIsZipping(true);

    try {
      await onDownloadAll();
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 max-h-[50vh] overflow-y-auto border-t border-white/10 bg-[#0f172a]">
      <div className="flex items-center justify-between px-5 pt-3">
        <p className="text-sm text-white/70">Dönüşüm Sonuçları</p>

        <div className="flex items-center gap-2">
          {hasMultipleSuccessful ? (
            <button
              type="button"
              onClick={() => void handleDownloadAll()}
              disabled={isZipping}
              className="flex items-center gap-1.5 rounded-lg bg-[#1A9BA1] px-3 py-1.5 text-xs text-white transition-colors duration-150 hover:bg-[#4BBFC4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isZipping ? (
                <>
                  <TbLoader2 className="animate-spin text-xs" />
                  Hazırlanıyor...
                </>
              ) : (
                <>
                  <TbFileZip className="text-xs" />
                  Tümünü İndir (.zip)
                </>
              )}
            </button>
          ) : null}

          <button
            type="button"
            onClick={clearJobs}
            className="text-xs text-white/50 transition-colors hover:text-white/80"
          >
            Tümünü Kapat
          </button>
        </div>
      </div>

      <div className="pb-3">
        {jobs.map((job) => (
          <JobResultCard
            key={job.id}
            job={job}
            onChain={(toFormat) => void chainConvert(job, toFormat)}
            onRetry={retryJob}
          />
        ))}
      </div>
    </div>
  );
}
