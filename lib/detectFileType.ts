import type { FileType } from "@/types";

const EXTENSION_MAP: Record<string, FileType> = {
  xlsx: "excel",
  xls: "excel",
  docx: "word",
  doc: "word",
  pdf: "pdf",
  pptx: "powerpoint",
  ppt: "powerpoint",
};

export function detectFileType(filename: string): FileType | null {
  const extension = filename.split(".").pop()?.toLowerCase();

  if (!extension) {
    return null;
  }

  return EXTENSION_MAP[extension] ?? null;
}
