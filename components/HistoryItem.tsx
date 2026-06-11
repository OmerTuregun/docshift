"use client";

import {
  TbDownload,
  TbFileText,
  TbFileTypePdf,
  TbLink,
  TbPresentation,
  TbRefresh,
  TbTable,
  TbTrash,
} from "react-icons/tb";
import type { OutputFormat } from "@/lib/converters";
import type { ConversionRecord } from "@/lib/db/history";
import { getFileExtension, sanitizeFileName } from "@/lib/downloadZip";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import type { FileType } from "@/types";

const FILE_TYPE_CONFIG: Record<
  FileType,
  { bg: string; icon: typeof TbTable; label: string }
> = {
  excel: { bg: "bg-[#217346]", icon: TbTable, label: "Excel" },
  word: { bg: "bg-[#2B579A]", icon: TbFileText, label: "Word" },
  pdf: { bg: "bg-[#F40F02]", icon: TbFileTypePdf, label: "PDF" },
  powerpoint: {
    bg: "bg-[#D24726]",
    icon: TbPresentation,
    label: "PPT",
  },
};

const FORMAT_CONFIG: Record<
  OutputFormat,
  { bg: string; text: string; label: string }
> = {
  json: { bg: "bg-[#EAF3DE]", text: "text-[#3B6D11]", label: "JSON" },
  xml: { bg: "bg-[#E6F1FB]", text: "text-[#185FA5]", label: "XML" },
  markdown: { bg: "bg-[#d0f0f2]", text: "text-[#1D3461]", label: "MD" },
  plaintext: { bg: "bg-[#F1EFE8]", text: "text-[#5F5E5A]", label: "TXT" },
};

interface HistoryItemProps {
  record: ConversionRecord;
  onDelete: (id: string) => void;
  onReconvert?: (record: ConversionRecord) => void;
}

export default function HistoryItem({
  record,
  onDelete,
  onReconvert,
}: HistoryItemProps) {
  const fileType = record.file_type as FileType;
  const config =
    FILE_TYPE_CONFIG[fileType] ?? FILE_TYPE_CONFIG.excel;
  const FileIcon = config.icon;
  const outputFormat = record.output_format as OutputFormat;
  const formatConfig =
    FORMAT_CONFIG[outputFormat] ?? FORMAT_CONFIG.plaintext;

  const handleDownload = () => {
    const ext = getFileExtension(outputFormat);
    const blob = new Blob([record.converted_result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = sanitizeFileName(record.file_name) + ext;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-gray-50">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}
      >
        <FileIcon className="text-sm text-white" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="max-w-[130px] truncate text-xs font-medium text-gray-700">
            {record.file_name}
          </span>
          {record.file_name.includes("→") ? (
            <TbLink className="shrink-0 text-[10px] text-[#1A9BA1]" />
          ) : null}
        </div>

        <div className="mt-0.5 flex items-center gap-1.5">
          <span
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${formatConfig.bg} ${formatConfig.text}`}
          >
            {formatConfig.label}
          </span>
          <span className="text-[10px] text-gray-300">·</span>
          <span className="text-[10px] text-gray-400">
            {formatRelativeTime(record.created_at)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {onReconvert ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onReconvert(record);
            }}
            className="rounded-lg p-1.5 text-gray-300 transition-all duration-150 hover:bg-[#d0f0f2] hover:text-[#1A9BA1]"
            title="Tekrar dönüştür"
          >
            <TbRefresh className="text-xs" />
          </button>
        ) : null}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleDownload();
          }}
          className="rounded-lg p-1.5 text-gray-300 transition-all duration-150 hover:bg-[#d0f0f2] hover:text-[#1A9BA1]"
          title="İndir"
        >
          <TbDownload className="text-xs" />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(record.id);
          }}
          className="rounded-lg p-1.5 text-gray-300 transition-all duration-150 hover:bg-red-50 hover:text-red-400"
          title="Sil"
        >
          <TbTrash className="text-xs" />
        </button>
      </div>
    </div>
  );
}
