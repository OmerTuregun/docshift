export type FileType = "excel" | "word" | "pdf" | "powerpoint";

export interface UploadedFile {
  file: File;
  fileType: FileType;
}
