import {
  ACCEPTED_FILE_TYPES,
  FILE_SIZE_ERROR,
  FILE_SIZE_LIMIT_BYTES,
  FILE_TYPE_ERROR,
} from "@/lib/constants";
import type { FileType } from "@/types";

export type FileValidationResult =
  | { valid: true }
  | { valid: false; error: string; code: "FILE_TOO_LARGE" | "INVALID_TYPE" };

export function validateFile(
  file: File,
  fileType: FileType,
): FileValidationResult {
  if (file.size > FILE_SIZE_LIMIT_BYTES) {
    return {
      valid: false,
      error: `${file.name}: ${FILE_SIZE_ERROR} (${(file.size / 1024 / 1024).toFixed(1)}MB)`,
      code: "FILE_TOO_LARGE",
    };
  }

  const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  const allowed = ACCEPTED_FILE_TYPES[fileType].extensions;

  if (!allowed.includes(ext as (typeof allowed)[number])) {
    return {
      valid: false,
      error: `${file.name}: ${FILE_TYPE_ERROR} (beklenen: ${allowed.join(", ")})`,
      code: "INVALID_TYPE",
    };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
