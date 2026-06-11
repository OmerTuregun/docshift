"use client";

import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { nanoid } from "nanoid";
import { saveAnonConversion } from "@/lib/anonHistory";
import type { OutputFormat } from "@/lib/converters";
import { dispatchHistoryUpdated } from "@/lib/historyEvents";
import { incrementSessionCount } from "@/lib/sessionCount";
import { validateFile } from "@/lib/validateFile";
import { showToast } from "@/components/Toast";
import type { FileType, UploadJob } from "@/types";

export function useFileUpload() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
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
        incrementSessionCount();

        if (!isAuthenticated) {
          saveAnonConversion({
            file_name: job.file.name,
            file_type: job.fileType,
            output_format: job.outputFormat,
            converted_result: data.converted,
            created_at: new Date().toISOString(),
          });
        }

        dispatchHistoryUpdated();
      } catch (uploadError) {
        const message =
          uploadError instanceof Error ? uploadError.message : "Upload failed";

        updateJob(job.id, { status: "error", error: message });
      }
    },
    [isAuthenticated, updateJob],
  );

  const addFiles = useCallback(
    (files: File[], fileType: FileType, format: OutputFormat) => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        const result = validateFile(file, fileType);

        if (result.valid) {
          validFiles.push(file);
        } else {
          errors.push(result.error);
        }
      }

      for (const error of errors) {
        showToast(error, "error", 5000);
      }

      if (validFiles.length === 0) {
        return;
      }

      const newJobs: UploadJob[] = validFiles.map((file) => ({
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

  const chainConvert = useCallback(
    async (job: UploadJob, toFormat: OutputFormat) => {
      if (job.status !== "success" || !job.result) {
        return;
      }

      if (toFormat === job.outputFormat) {
        return;
      }

      const chainedJob: UploadJob = {
        id: crypto.randomUUID(),
        file: job.file,
        fileType: job.fileType,
        outputFormat: toFormat,
        status: "loading",
        isChained: true,
        chainedFrom: job.outputFormat,
      };

      setJobs((prev) => [...prev, chainedJob]);

      try {
        const response = await fetch("/api/convert-chain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: job.result,
            fromFormat: job.outputFormat,
            toFormat,
            fileName: job.file.name,
            fileType: job.fileType,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error ?? "Chain conversion failed");
        }

        updateJob(chainedJob.id, {
          status: "success",
          result: data.converted,
        });
        window.dispatchEvent(new CustomEvent("stats:updated"));
        incrementSessionCount();

        if (!isAuthenticated) {
          saveAnonConversion({
            file_name: `${job.file.name} (${job.outputFormat}→${toFormat})`,
            file_type: job.fileType,
            output_format: toFormat,
            converted_result: data.converted,
            created_at: new Date().toISOString(),
          });
        }

        dispatchHistoryUpdated();
      } catch (chainError) {
        const message =
          chainError instanceof Error
            ? chainError.message
            : "Chain conversion failed";

        updateJob(chainedJob.id, { status: "error", error: message });
      }
    },
    [isAuthenticated, updateJob],
  );

  return { jobs, addFiles, clearJobs, chainConvert };
}
