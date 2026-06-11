"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  TbArrowRight,
  TbBraces,
  TbCode,
  TbFileTypeTxt,
  TbLoader2,
  TbMarkdown,
  TbRefresh,
  TbX,
} from "react-icons/tb";
import type { OutputFormat } from "@/lib/converters";
import { isOutputFormat } from "@/lib/converters";
import type { ConversionRecord } from "@/lib/db/history";

const ALL_FORMATS: {
  value: OutputFormat;
  label: string;
  icon: typeof TbBraces;
}[] = [
  { value: "json", label: "JSON", icon: TbBraces },
  { value: "xml", label: "XML", icon: TbCode },
  { value: "markdown", label: "Markdown", icon: TbMarkdown },
  { value: "plaintext", label: "Plain Text", icon: TbFileTypeTxt },
];

interface ReconvertModalProps {
  record: ConversionRecord | null;
  onClose: () => void;
  onConfirm: (record: ConversionRecord, toFormat: OutputFormat) => void;
  isLoading?: boolean;
}

export default function ReconvertModal({
  record,
  onClose,
  onConfirm,
  isLoading = false,
}: ReconvertModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>("json");

  const formats = useMemo(
    () =>
      record
        ? ALL_FORMATS.filter((format) => format.value !== record.output_format)
        : [],
    [record],
  );

  useEffect(() => {
    if (formats.length > 0) {
      setSelectedFormat(formats[0].value);
    }
  }, [formats, record]);

  return (
    <AnimatePresence>
      {record ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 z-[61] mx-4 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#1D3461]">
                  Tekrar Dönüştür
                </h3>
                <p className="mt-1 text-xs text-gray-400">{record.file_name}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 transition hover:bg-gray-100"
                aria-label="Kapat"
              >
                <TbX className="text-sm text-gray-400" />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
              <TbArrowRight className="text-xs text-gray-300" />
              <span className="text-xs text-gray-400">Mevcut format:</span>
              <span className="text-xs font-medium text-[#1D3461] uppercase">
                {isOutputFormat(record.output_format)
                  ? record.output_format
                  : record.output_format}
              </span>
            </div>

            <p className="mb-3 text-xs text-gray-400">Yeni format seçin:</p>

            <div className="mb-5 grid grid-cols-2 gap-2">
              {formats.map((format) => {
                const Icon = format.icon;
                const isSelected = selectedFormat === format.value;

                return (
                  <button
                    key={format.value}
                    type="button"
                    onClick={() => setSelectedFormat(format.value)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isSelected
                        ? "border-[#1A9BA1] bg-[#d0f0f2] text-[#1D3461]"
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                    }`}
                  >
                    <Icon
                      className={`text-base ${
                        isSelected ? "text-[#1A9BA1]" : "text-gray-400"
                      }`}
                    />
                    {format.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => onConfirm(record, selectedFormat)}
              disabled={isLoading || formats.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A9BA1] py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#1D3461] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <TbLoader2 className="animate-spin" />
                  Dönüştürülüyor...
                </>
              ) : (
                <>
                  <TbRefresh />
                  Dönüştür
                </>
              )}
            </button>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
