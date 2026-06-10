"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TbCheck, TbCopy, TbDownload, TbLoader2, TbX } from "react-icons/tb";
import type { OutputFormat } from "@/lib/converters";
import type { FileType, UploadJob } from "@/types";

const FILE_TYPE_COLORS: Record<FileType, string> = {
  excel: "#217346",
  word: "#2B579A",
  pdf: "#F40F02",
  powerpoint: "#D24726",
};

const EXTENSION_BY_FORMAT: Record<OutputFormat, string> = {
  json: "json",
  xml: "xml",
  markdown: "md",
  plaintext: "txt",
};

const FORMAT_LABELS: Record<OutputFormat, string> = {
  json: "JSON",
  xml: "XML",
  markdown: "Markdown",
  plaintext: "Plain Text",
};

interface JobResultCardProps {
  job: UploadJob;
  onToast: (message: string) => void;
}

export default function JobResultCard({ job, onToast }: JobResultCardProps) {
  const [showError, setShowError] = useState(false);

  const handleCopy = async () => {
    if (!job.result) return;

    try {
      await navigator.clipboard.writeText(job.result);
      onToast("Copied!");
    } catch {
      onToast("Copy failed");
    }
  };

  const handleDownload = () => {
    if (!job.result) return;

    const extension = EXTENSION_BY_FORMAT[job.outputFormat];
    const baseName = job.file.name.replace(/\.[^.]+$/, "");
    const blob = new Blob([job.result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${baseName}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 border-b border-white/5 px-5 py-3 last:border-b-0"
    >
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: FILE_TYPE_COLORS[job.fileType] }}
      />

      <p className="min-w-0 flex-1 truncate text-sm text-white/90">
        {job.file.name}
      </p>

      <div className="flex shrink-0 items-center gap-2">
        {job.status === "loading" || job.status === "idle" ? (
          <TbLoader2 className="animate-spin text-brand-teal" size={16} />
        ) : null}

        {job.status === "success" ? (
          <TbCheck className="text-emerald-400" size={16} />
        ) : null}

        {job.status === "error" ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowError((prev) => !prev)}
              className="text-red-400"
              aria-label="Show error"
            >
              <TbX size={16} />
            </button>
            {showError && job.error ? (
              <div className="absolute right-0 bottom-full z-50 mb-2 w-48 rounded-lg bg-red-900/90 px-3 py-2 text-xs text-white shadow-lg">
                {job.error}
              </div>
            ) : null}
          </div>
        ) : null}

        <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/70">
          {FORMAT_LABELS[job.outputFormat]}
        </span>

        {job.status === "success" ? (
          <>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg p-1.5 text-white/50 transition-colors hover:text-white"
              aria-label="Copy"
            >
              <TbCopy size={15} />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-lg p-1.5 text-white/50 transition-colors hover:text-white"
              aria-label="Download"
            >
              <TbDownload size={15} />
            </button>
          </>
        ) : null}
      </div>
    </motion.div>
  );
}
