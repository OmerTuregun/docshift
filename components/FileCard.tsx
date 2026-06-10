"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { TbUpload } from "react-icons/tb";
import OutputFormatSelector from "@/components/OutputFormatSelector";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { OutputFormat } from "@/lib/converters";
import type { FileType } from "@/types";

const FORMAT_OPTIONS: { value: OutputFormat; label: string }[] = [
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "markdown", label: "Markdown" },
  { value: "plaintext", label: "Plain Text" },
];

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
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 [backface-visibility:hidden]">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 sm:h-16 sm:w-16 [&>svg]:h-7 [&>svg]:w-7 sm:[&>svg]:h-8 sm:[&>svg]:w-8 [&>svg]:text-white">
        {icon}
      </div>

      <h2 className="text-sm font-medium text-white sm:text-base">{title}</h2>
      <p className="mt-1 text-xs text-white/50">{subtitle}</p>

      <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-dashed border-white/30 px-3 py-1.5 text-xs text-white/70 transition-all duration-200 group-hover:border-white/60 group-hover:text-white/90">
        <TbUpload className="text-xs" />
        Dosya yükle
      </div>

      <div className="absolute right-3 bottom-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
        <TbUpload className="text-xs text-white/60" />
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
  const [isDragOver, setIsDragOver] = useState(false);
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
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
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
          className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-2xl shadow-md"
          style={{ background: bgColor }}
        >
          <FrontFace title={title} subtitle={subtitle} icon={icon} />
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs text-gray-500">Çıktı formatı</label>
          <select
            value={outputFormat}
            onChange={(event) =>
              setOutputFormat(event.target.value as OutputFormat)
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#1D3461] outline-none focus:border-[#1A9BA1]"
          >
            {FORMAT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {fileInput}
      </div>
    );
  }

  return (
    <div
      className="group w-full"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => {
        setIsFlipped(false);
        setIsDragOver(false);
      }}
    >
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-md md:aspect-[4/5]"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ background: bgColor, backfaceVisibility: "hidden" }}
          >
            <FrontFace title={title} subtitle={subtitle} icon={icon} />
          </div>

          <div
            className="absolute inset-0 flex flex-col rounded-2xl"
            style={{
              background: bgColor,
              filter: isDragOver ? "brightness(1.15)" : "brightness(0.88)",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {isDragOver ? (
              <div className="pointer-events-none absolute inset-0 animate-pulse rounded-2xl border-2 border-white/60" />
            ) : null}

            <div className="flex shrink-0 flex-col items-center pt-3 text-center">
              <div className="text-2xl text-white [&>svg]:h-6 [&>svg]:w-6 [&>svg]:text-white">
                {icon}
              </div>
              <p className="mt-1 text-sm text-white/80">{title}</p>
            </div>

            <div className="shrink-0 px-3 pt-2">
              <OutputFormatSelector
                value={outputFormat}
                onChange={setOutputFormat}
              />
            </div>

            <div className="flex flex-1 flex-col px-3 pt-2 pb-3">
              <button
                type="button"
                onClick={handleDropzoneClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className="flex min-h-[88px] flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-white/40 px-3 py-3 text-center text-xs leading-snug text-white/60 transition hover:border-white/80 hover:bg-white/10"
              >
                <TbUpload className="text-base text-white/50" />
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
