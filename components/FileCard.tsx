"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TbUpload } from "react-icons/tb";
import OutputFormatSelector from "@/components/OutputFormatSelector";
import type { ResultPanelData } from "@/components/ResultPanel";
import { useFileUpload } from "@/hooks/useFileUpload";
import type { FileType } from "@/types";

interface FileCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  fileType: FileType;
  accept: string;
  bgColor: string;
  onResult: (result: ResultPanelData) => void;
  onToast: (message: string) => void;
}

export default function FileCard({
  title,
  subtitle,
  icon,
  fileType,
  accept,
  bgColor,
  onResult,
  onToast,
}: FileCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
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
          <div className="flex items-center justify-center text-[52px] text-white">
            {icon}
          </div>
          <h2 className="mt-3 text-base font-medium text-white">{title}</h2>
          <p className="mt-1 text-xs text-white/50">{subtitle}</p>
          <div className="absolute right-3 bottom-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
            <TbUpload className="text-xs text-white/70" />
          </div>
        </div>

        <div
          className="absolute inset-0 flex flex-col"
          style={{
            backgroundColor: bgColor,
            filter: "brightness(0.88)",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex flex-col items-center pt-5 text-center">
            <div className="text-[32px] text-white">{icon}</div>
            <p className="mt-1 text-sm text-white/80">{title}</p>
          </div>

          <div className="px-3 pt-2">
            <OutputFormatSelector
              value={outputFormat}
              onChange={setOutputFormat}
            />
          </div>

          <div className="relative mx-4 mt-3 mb-4 flex flex-1 flex-col">
            <button
              type="button"
              onClick={handleDropzoneClick}
              disabled={isLoading}
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/40 px-3 text-center text-xs text-white/60 transition hover:border-white/80 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>
                Dosyayı buraya sürükle
                <br />
                veya tıkla
              </span>
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
