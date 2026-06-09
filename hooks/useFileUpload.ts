"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { saveAnonConversion } from "@/lib/anonHistory";
import type { OutputFormat } from "@/lib/converters";
import { dispatchHistoryUpdated } from "@/lib/historyEvents";
import { incrementSessionCount } from "@/lib/sessionStats";
import type { FileType } from "@/types";

interface UploadSuccess {
  converted: string;
  fileName: string;
  format: OutputFormat;
}

export function useFileUpload() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("json");

  const uploadFile = async (
    file: File,
    fileType: FileType,
    format: OutputFormat,
  ): Promise<UploadSuccess> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", fileType);
      formData.append("outputFormat", format);

      const response = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Upload failed");
      }

      setResult(data.converted);
      incrementSessionCount();

      if (session?.user?.id) {
        dispatchHistoryUpdated();
      } else {
        saveAnonConversion({
          file_name: file.name,
          file_type: fileType,
          output_format: format,
          converted_result: data.converted,
          created_at: new Date().toISOString(),
        });
        dispatchHistoryUpdated();
      }

      return {
        converted: data.converted,
        fileName: file.name,
        format,
      };
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : "Upload failed";

      setError(message);
      throw uploadError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    result,
    outputFormat,
    setOutputFormat,
    uploadFile,
    clearError: () => setError(null),
  };
}
