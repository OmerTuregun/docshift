"use client";

import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { nanoid } from "nanoid";
import { saveAnonConversion } from "@/lib/anonHistory";
import type { OutputFormat } from "@/lib/converters";
import { dispatchHistoryUpdated } from "@/lib/historyEvents";
import type { FileType, UploadJob } from "@/types";

export function useFileUpload() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<UploadJob[]>([]);

  const updateJob = useCallback((id: string, patch: Partial<UploadJob>) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, ...patch } : job)),
    );
  }, []);

  const uploadJob = useCallback(
    async (job: UploadJob) => {
      updateJob(job.id, { status: "loading" });

      try {
        const formData = new FormData();
        formData.append("file", job.file);
        formData.append("fileType", job.fileType);
        formData.append("outputFormat", job.outputFormat);

        const response = await fetch("/api/parse", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error ?? "Upload failed");
        }

        updateJob(job.id, { status: "success", result: data.converted });
        window.dispatchEvent(new CustomEvent("stats:updated"));

        if (session?.user?.id) {
          dispatchHistoryUpdated();
        } else {
          saveAnonConversion({
            file_name: job.file.name,
            file_type: job.fileType,
            output_format: job.outputFormat,
            converted_result: data.converted,
            created_at: new Date().toISOString(),
          });
          dispatchHistoryUpdated();
        }
      } catch (uploadError) {
        const message =
          uploadError instanceof Error ? uploadError.message : "Upload failed";

        updateJob(job.id, { status: "error", error: message });
      }
    },
    [session?.user?.id, updateJob],
  );

  const addFiles = useCallback(
    (files: File[], fileType: FileType, format: OutputFormat) => {
      const newJobs: UploadJob[] = files.map((file) => ({
        id: nanoid(),
        file,
        fileType,
        outputFormat: format,
        status: "idle",
      }));

      setJobs((prev) => [...prev, ...newJobs]);
      newJobs.forEach((job) => {
        void uploadJob(job);
      });
    },
    [uploadJob],
  );

  const clearJobs = useCallback(() => {
    setJobs([]);
  }, []);

  return { jobs, addFiles, clearJobs };
}
