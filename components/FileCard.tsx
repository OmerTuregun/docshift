"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { TbUpload } from "react-icons/tb";
import OutputFormatSelector from "@/components/OutputFormatSelector";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { OutputFormat } from "@/lib/converters";
import type { FileType } from "@/types";

interface FileCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  fileType: FileType;
  accept: string;
  bgColor: string;
  addFiles: (files: File[], fileType: FileType, format: OutputFormat) => void;
}

function FrontFace({
  title,
  subtitle,
  icon,
  bgColor,
  onTapHintClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
  onTapHintClick?: () => void;
}) {
  return (
    <div
      className="relative flex h-full flex-col items-center justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center justify-center text-[52px] text-white">
        {icon}
      </div>
      <h2 className="mt-3 text-base font-medium text-white">{title}</h2>
      <p className="mt-1 text-xs text-white/50">{subtitle}</p>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onTapHintClick?.();
        }}
        className="mt-3 flex items-center gap-1.5 rounded-lg border border-white/30 px-3 py-1.5 text-xs text-white/70 md:pointer-events-none md:opacity-0"
      >
        <TbUpload className="text-xs" />
        Dosya yüklemek için tıkla
      </button>

      <div className="absolute right-3 bottom-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 md:block">
        <TbUpload className="text-xs text-white/70" />
      </div>
    </div>
  );
}

export default function FileCard({
  title,
  subtitle,
  icon,
  fileType,
  accept,
  bgColor,
  addFiles,
}: FileCardProps) {
  const isMobile = useIsMobile();
  const [isFlipped, setIsFlipped] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("json");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    addFiles(files, fileType, outputFormat);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    handleFiles(files);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDropzoneClick = () => {
    inputRef.current?.click();
  };

  const handleMobileCardClick = () => {
    if (!isMobile) return;
    inputRef.current?.click();
  };

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      multiple
      className="hidden"
      onChange={handleFileChange}
    />
  );

  if (isMobile) {
    return (
      <div className="w-full">
        <div
          role="button"
          tabIndex={0}
          onClick={handleMobileCardClick}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleMobileCardClick();
            }
          }}
          className="relative w-full aspect-square cursor-pointer overflow-hidden rounded-2xl shadow-sm"
        >
          <FrontFace
            title={title}
            subtitle={subtitle}
            icon={icon}
            bgColor={bgColor}
            onTapHintClick={handleDropzoneClick}
          />
        </div>

        <div className="mt-3">
          <OutputFormatSelector
            value={outputFormat}
            onChange={setOutputFormat}
            variant="inline"
          />
        </div>

        {fileInput}
      </div>
    );
  }

  return (
    <div
      className="group w-full"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className="relative w-full aspect-square overflow-hidden rounded-2xl shadow-sm"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden" }}
          >
            <FrontFace
              title={title}
              subtitle={subtitle}
              icon={icon}
              bgColor={bgColor}
            />
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
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/40 px-3 text-center text-xs text-white/60 transition hover:border-white/80 hover:bg-white/10"
              >
                <span>
                  Dosyayı buraya sürükle
                  <br />
                  veya tıkla
                </span>
              </button>
            </div>

            {fileInput}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
