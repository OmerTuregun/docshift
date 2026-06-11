"use client";

import { createContext, useContext } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";

type FileUploadContextValue = ReturnType<typeof useFileUpload>;

const FileUploadContext = createContext<FileUploadContextValue | null>(null);

export function FileUploadProvider({ children }: { children: React.ReactNode }) {
  const value = useFileUpload();

  return (
    <FileUploadContext.Provider value={value}>{children}</FileUploadContext.Provider>
  );
}

export function useFileUploadContext() {
  const context = useContext(FileUploadContext);

  if (!context) {
    throw new Error(
      "useFileUploadContext must be used within FileUploadProvider",
    );
  }

  return context;
}
