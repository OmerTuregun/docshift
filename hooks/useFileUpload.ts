"use client";

import { useState } from "react";
import type { OutputFormat } from "@/lib/converters";
import type { FileType } from "@/types";

interface UploadSuccess {
  converted: string;
  fileName: string;
  format: OutputFormat;
}

export function useFileUpload() {
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
