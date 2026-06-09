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
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-5xl rounded-t-2xl bg-gray-900 p-5 shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <FiX size={18} />
            </button>

            <div className="mb-4 flex items-center justify-between gap-4 pr-10">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {data.fileName}
                </p>
                <span className="mt-1 inline-block rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/80">
                  {FORMAT_LABELS[data.format]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20"
                >
                  <FiCopy size={16} />
                  {isCopying ? "Copied!" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20"
                >
                  <FiDownload size={16} />
                  Download
                </button>
              </div>
            </div>

            <pre className="max-h-[60vh] overflow-auto rounded-xl bg-black/80 p-4 text-sm text-green-400">
              <code>{data.result}</code>
            </pre>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}
