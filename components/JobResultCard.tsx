"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TbCheck,
  TbClock,
  TbCopy,
  TbDownload,
  TbFileOff,
  TbLink,
  TbLoader2,
  TbRefresh,
  TbX,
} from "react-icons/tb";
import { showToast } from "@/components/Toast";
import { FILE_SIZE_LIMIT_MB } from "@/lib/constants";
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

const CHAIN_FORMATS: OutputFormat[] = ["json", "xml", "markdown", "plaintext"];

const CHAIN_BUTTON_LABELS: Record<OutputFormat, string> = {
  json: "JSON",
  xml: "XML",
  markdown: "MD",
  plaintext: "TXT",
};

interface JobResultCardProps {
  job: UploadJob;
  onChain: (toFormat: OutputFormat) => void;
  onRetry: (job: UploadJob) => void;
}

function isRateLimitedError(error?: string): boolean {
  return Boolean(error?.startsWith("rate_limited:"));
}

function getRateLimitRetryAfter(error?: string): string {
  return error?.split(":")[1] ?? "60";
}

function isFileTooLargeError(error?: string): boolean {
  if (!error) return false;

  return (
    error.includes("FILE_TOO_LARGE") ||
    error.includes("limitini aşıyor") ||
    error.includes("Dosya boyutu")
  );
}

export default function JobResultCard({
  job,
  onChain,
  onRetry,
}: JobResultCardProps) {
  const [showError, setShowError] = useState(false);

  const handleCopy = async () => {
    if (!job.result) return;

    try {
      await navigator.clipboard.writeText(job.result);
      showToast("Copied!", "success");
    } catch {
      showToast("Copy failed", "error");
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

  const chainTargets = CHAIN_FORMATS.filter(
    (format) => format !== job.outputFormat,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-white/5 px-5 py-3 last:border-b-0"
    >
      <div className="flex items-center gap-3">
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
                <div className="absolute right-0 bottom-full z-50 mb-2 w-56 rounded-lg bg-red-900/90 px-3 py-2 text-xs text-white shadow-lg">
                  {isRateLimitedError(job.error) ? (
                    <div>
                      <div className="flex items-center gap-2 text-amber-400">
                        <TbClock className="shrink-0 text-base" />
                        <div>
                          <div className="text-xs font-medium text-white">
                            İstek limiti aşıldı
                          </div>
                          <div className="mt-0.5 text-[10px] text-amber-200/80">
                            {getRateLimitRetryAfter(job.error)} saniye sonra tekrar
                            deneyin
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRetry(job)}
                        className="mt-2 flex items-center rounded-lg border border-amber-400/30 px-3 py-1 text-xs text-amber-300 transition hover:bg-amber-400/10"
                      >
                        <TbRefresh className="mr-1 text-xs" />
                        Tekrar dene
                      </button>
                    </div>
                  ) : isFileTooLargeError(job.error) ? (
                    <div className="flex items-center gap-2 text-red-400">
                      <TbFileOff className="shrink-0 text-base" />
                      <div>
                        <div className="text-xs font-medium text-white">
                          Dosya çok büyük
                        </div>
                        <div className="mt-0.5 text-[10px] text-red-200/80">
                          Maks. {FILE_SIZE_LIMIT_MB}MB yükleyebilirsiniz
                        </div>
                      </div>
                    </div>
                  ) : (
                    job.error
                  )}
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
      </div>

      {job.status === "success" && job.isChained && job.chainedFrom ? (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-white/30">
          <TbLink className="text-[10px]" aria-hidden="true" />
          {job.chainedFrom} → {job.outputFormat}
        </div>
      ) : null}

      {job.status === "success" && !job.isChained ? (
        <div className="mt-2 border-t border-white/10 pt-2">
          <p className="mb-1.5 text-xs text-white/40">Tekrar dönüştür:</p>
          <div className="flex flex-wrap gap-1.5">
            {chainTargets.map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => onChain(format)}
                className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white/60 transition-all duration-150 hover:bg-[#1A9BA1] hover:text-white"
              >
                {CHAIN_BUTTON_LABELS[format]}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
