"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import OutputFormatSelector from "@/components/OutputFormatSelector";
import type { ResultPanelData } from "@/components/ResultPanel";
import { useFileUpload } from "@/hooks/useFileUpload";
import type { FileType } from "@/types";

interface FileCardProps {
  title: string;
  icon: React.ReactNode;
  fileType: FileType;
  accept: string;
  bgColor: string;
  iconColor: string;
  onResult: (result: ResultPanelData) => void;
  onToast: (message: string) => void;
}

export default function FileCard({
  title,
  icon,
  fileType,
  accept,
  bgColor,
  iconColor,
  onResult,
  onToast,
}: FileCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    isLoading,
    error,
    outputFormat,
    setOutputFormat,
    uploadFile,
    clearError,
  } = useFileUpload();

  useEffect(() => {
    if (!error) return;

    const timer = window.setTimeout(() => {
      clearError();
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [error, clearError]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || isLoading) return;

    setSelectedFile(file);

    try {
      const uploadResult = await uploadFile(file, fileType, outputFormat);
      onResult({
        result: uploadResult.converted,
        format: uploadResult.format,
        fileName: uploadResult.fileName,
      });
    } catch {
      onToast("Upload failed");
    } finally {
      event.target.value = "";
    }
  };

  const handleDropzoneClick = () => {
    if (isLoading) return;
    inputRef.current?.click();
  };

  return (
    <div
      className="relative aspect-square w-full"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ backgroundColor: bgColor, backfaceVisibility: "hidden" }}
        >
          <div
            className="mb-4 flex items-center justify-center"
            style={{ color: iconColor, fontSize: "80px" }}
          >
            {icon}
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center p-4"
          style={{
            backgroundColor: bgColor,
            filter: "brightness(0.85)",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className="mb-2 flex shrink-0 items-center justify-center pt-2"
            style={{ color: iconColor, fontSize: "40px" }}
          >
            {icon}
          </div>

          <OutputFormatSelector
            value={outputFormat}
            onChange={setOutputFormat}
          />

          <div className="relative flex w-full flex-1 flex-col">
            <button
              type="button"
              onClick={handleDropzoneClick}
              disabled={isLoading}
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/60 px-4 text-center text-sm text-white/80 transition-colors hover:border-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {selectedFile ? selectedFile.name : "Drop file here"}
            </button>

            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
              </div>
            ) : null}

            {error ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-red-900/70 p-4 text-center text-sm font-medium text-white">
                {error}
              </div>
            ) : null}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
      </motion.div>
    </div>
  );
}
