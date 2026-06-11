export const FILE_SIZE_LIMIT_MB = 10;
export const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MB * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = {
  excel: {
    extensions: [".xlsx", ".xls"],
    mime: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  },
  word: {
    extensions: [".docx", ".doc"],
    mime: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  pdf: {
    extensions: [".pdf"],
    mime: ["application/pdf"],
  },
  powerpoint: {
    extensions: [".pptx", ".ppt"],
    mime: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
  },
} as const;

export const FILE_SIZE_ERROR = `Dosya boyutu ${FILE_SIZE_LIMIT_MB}MB limitini aşıyor`;

export const FILE_TYPE_ERROR = "Desteklenmeyen dosya türü";
