"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { nanoid } from "nanoid";
import { showToast } from "@/components/Toast";
import { saveAnonConversion } from "@/lib/anonHistory";
import type { OutputFormat } from "@/lib/converters";
import { dispatchHistoryUpdated } from "@/lib/historyEvents";
import { incrementSessionCount } from "@/lib/sessionCount";
import { downloadZip, getFileExtension, sanitizeFileName } from "@/lib/downloadZip";
import type { ConversionRecord } from "@/lib/db/history";
import { validateFile } from "@/lib/validateFile";
import type { FileType, UploadJob } from "@/types";

function handleRateLimitedResponse(
  data: { error?: string; retryAfter?: number },
  updateJob: (id: string, patch: Partial<UploadJob>) => void,
  jobId: string,
) {
  const retryAfter = data.retryAfter ?? 60;

  showToast(
    data.error ?? "Çok fazla istek. Lütfen bekleyin.",
    "error",
    6000,
  );

  updateJob(jobId, {
    status: "error",
    error: `rate_limited:${retryAfter}`,
  });
}

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
      updateJob(job.id, { status: "loading", error: undefined });

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

        if (response.status === 429) {
          handleRateLimitedResponse(data, updateJob, job.id);
          return;
        }

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

  const retryJob = useCallback(
    (job: UploadJob) => {
      const resetJob: UploadJob = {
        ...job,
        status: "idle",
        error: undefined,
        result: undefined,
      };

      updateJob(job.id, {
        status: "idle",
        error: undefined,
        result: undefined,
      });

      void uploadJob(resetJob);
    },
    [updateJob, uploadJob],
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

        if (response.status === 429) {
          handleRateLimitedResponse(data, updateJob, chainedJob.id);
          return;
        }

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

  const reconvertFromHistory = useCallback(
    async (record: ConversionRecord, toFormat: OutputFormat) => {
      const fromFormat = record.output_format as OutputFormat;

      if (toFormat === fromFormat) {
        throw new Error("Aynı formata dönüştürülemez");
      }

      const fileType = record.file_type as FileType;
      const chainedJob: UploadJob = {
        id: crypto.randomUUID(),
        file: new File([record.converted_result], record.file_name, {
          type: "text/plain",
        }),
        fileType,
        outputFormat: toFormat,
        status: "loading",
        isChained: true,
        chainedFrom: fromFormat,
      };

      setJobs((prev) => [...prev, chainedJob]);

      try {
        const response = await fetch("/api/convert-chain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: record.converted_result,
            fromFormat: record.output_format,
            toFormat,
            fileName: record.file_name,
            fileType: record.file_type,
          }),
        });

        const data = await response.json();

        if (response.status === 429) {
          handleRateLimitedResponse(data, updateJob, chainedJob.id);
          throw new Error(data.error ?? "Rate limited");
        }

        if (!response.ok || !data.success) {
          throw new Error(data.error ?? "Reconvert failed");
        }

        updateJob(chainedJob.id, {
          status: "success",
          result: data.converted,
        });
        window.dispatchEvent(new CustomEvent("stats:updated"));
        incrementSessionCount();

        if (!isAuthenticated) {
          saveAnonConversion({
            file_name: `${record.file_name} (${fromFormat}→${toFormat})`,
            file_type: fileType,
            output_format: toFormat,
            converted_result: data.converted,
            created_at: new Date().toISOString(),
          });
        }

        dispatchHistoryUpdated();
      } catch (reconvertError) {
        const message =
          reconvertError instanceof Error
            ? reconvertError.message
            : "Reconvert failed";

        updateJob(chainedJob.id, { status: "error", error: message });
        throw reconvertError;
      }
    },
    [isAuthenticated, updateJob],
  );

  const downloadAllAsZip = useCallback(async () => {
    const successfulJobs = jobs.filter(
      (job) => job.status === "success" && job.result != null,
    );

    if (successfulJobs.length < 2) {
      return;
    }

    await downloadZip(
      successfulJobs.map((job) => ({
        fileName: job.file.name,
        outputFormat: job.outputFormat,
        result: job.result!,
      })),
    );
  }, [jobs]);

  const hasMultipleSuccessful =
    jobs.filter((job) => job.status === "success").length >= 2;

  useEffect(() => {
    const copyHandler = () => {
      const lastSuccess = [...jobs]
        .reverse()
        .find((job) => job.status === "success");

      if (lastSuccess?.result) {
        void navigator.clipboard.writeText(lastSuccess.result);
        showToast("Kopyalandı", "success");
      }
    };

    const downloadHandler = () => {
      const lastSuccess = [...jobs]
        .reverse()
        .find((job) => job.status === "success");

      if (!lastSuccess?.result) {
        return;
      }

      const ext = getFileExtension(lastSuccess.outputFormat);
      const blob = new Blob([lastSuccess.result], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = sanitizeFileName(lastSuccess.file.name) + ext;
      link.click();
      URL.revokeObjectURL(url);
    };

    const downloadAllHandler = () => {
      void downloadAllAsZip();
    };

    window.addEventListener("shortcut:copy-last", copyHandler);
    window.addEventListener("shortcut:download-last", downloadHandler);
    window.addEventListener("shortcut:download-all", downloadAllHandler);

    return () => {
      window.removeEventListener("shortcut:copy-last", copyHandler);
      window.removeEventListener("shortcut:download-last", downloadHandler);
      window.removeEventListener("shortcut:download-all", downloadAllHandler);
    };
  }, [downloadAllAsZip, jobs]);

  return {
    jobs,
    addFiles,
    clearJobs,
    chainConvert,
    retryJob,
    downloadAllAsZip,
    hasMultipleSuccessful,
    reconvertFromHistory,
  };
}
