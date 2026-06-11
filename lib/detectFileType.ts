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

const MIME_MAP: Record<string, FileType> = {
  "application/vnd.ms-excel": "excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "excel",
  "application/vnd.google-apps.spreadsheet": "excel",
  "application/msword": "word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "word",
  "application/vnd.google-apps.document": "word",
  "application/pdf": "pdf",
  "application/vnd.ms-powerpoint": "powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "powerpoint",
  "application/vnd.google-apps.presentation": "powerpoint",
};

export function detectFileType(
  filename: string,
  mimeType?: string,
): FileType | null {
  const extension = filename.split(".").pop()?.toLowerCase();

  if (extension && EXTENSION_MAP[extension]) {
    return EXTENSION_MAP[extension];
  }

  if (mimeType && MIME_MAP[mimeType]) {
    return MIME_MAP[mimeType];
  }

  return null;
}
