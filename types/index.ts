import type { OutputFormat } from "@/lib/converters";

export type FileType = "excel" | "word" | "pdf" | "powerpoint";

export interface UploadedFile {
  file: File;
  fileType: FileType;
}

export interface UploadJob {
  id: string;
  file: File;
  fileType: FileType;
  outputFormat: OutputFormat;
  status: "idle" | "loading" | "success" | "error";
  result?: string;
  error?: string;
}
