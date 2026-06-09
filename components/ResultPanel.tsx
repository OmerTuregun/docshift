"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCopy, FiDownload, FiX } from "react-icons/fi";
import type { OutputFormat } from "@/lib/converters";

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

export interface ResultPanelData {
  result: string;
  format: OutputFormat;
  fileName: string;
}

interface ResultPanelProps {
  data: ResultPanelData | null;
  onClose: () => void;
  onToast: (message: string) => void;
}

export default function ResultPanel({
  data,
  onClose,
  onToast,
}: ResultPanelProps) {
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    if (!data) return;

    try {
      await navigator.clipboard.writeText(data.result);
      setIsCopying(true);
      onToast("Copied!");
      window.setTimeout(() => setIsCopying(false), 2000);
    } catch {
      onToast("Copy failed");
    }
  };

  const handleDownload = () => {
    if (!data) return;

    const extension = EXTENSION_BY_FORMAT[data.format];
    const baseName = data.fileName.replace(/\.[^.]+$/, "");
    const blob = new Blob([data.result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${baseName}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {data ? (
        <>
          <motion.button
            type="button"
            aria-label="Close result panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40"
          />

          <motion.section
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-x-0 bottom-0 z-50 overflow-hidden rounded-t-2xl bg-[#0f172a] shadow-2xl"
          >
            <div className="flex items-center justify-between bg-[#1e293b] px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-2">
                <p className="truncate text-sm font-medium text-white/90">
                  {data.fileName}
                </p>
                <span className="rounded-md bg-brand-teal px-2 py-0.5 text-xs text-white">
                  {FORMAT_LABELS[data.format]}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg p-2 text-white/60 transition-colors hover:text-white"
                  aria-label="Copy"
                >
                  <FiCopy size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="rounded-lg p-2 text-white/60 transition-colors hover:text-white"
                  aria-label="Download"
                >
                  <FiDownload size={16} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-white/60 transition-colors hover:text-white"
                  aria-label="Close"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            <pre className="max-h-[55vh] overflow-auto bg-[#0f172a] p-5 font-mono text-sm text-emerald-400 [scrollbar-color:rgba(255,255,255,0.2)_transparent] [scrollbar-width:thin]">
              <code>{data.result}</code>
            </pre>

            {isCopying ? (
              <p className="sr-only">Copied to clipboard</p>
            ) : null}
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}
