"use client";

import { TbDownload, TbLink, TbTrash } from "react-icons/tb";
import type { ConversionRecord } from "@/lib/db/history";
import { downloadConvertedFile } from "@/lib/downloadConverted";
import { formatRelativeTime } from "@/lib/formatRelativeTime";

const FILE_TYPE_COLORS: Record<string, string> = {
  excel: "#217346",
  word: "#2B579A",
  pdf: "#F40F02",
  powerpoint: "#D24726",
};

const FORMAT_BADGE_CLASSES: Record<string, string> = {
  json: "bg-[#E1F5EE] text-[#0F6E56]",
  xml: "bg-[#E6F1FB] text-[#185FA5]",
  markdown: "bg-brand-teal-bg text-brand-navy",
  plaintext: "bg-[#F1EFE8] text-[#5F5E5A]",
};

const FORMAT_LABELS: Record<string, string> = {
  json: "JSON",
  xml: "XML",
  markdown: "Markdown",
  plaintext: "Plain Text",
};

interface HistoryItemProps {
  record: ConversionRecord;
  onDelete: (id: string) => void;
}

export default function HistoryItem({ record, onDelete }: HistoryItemProps) {
  const dotColor = FILE_TYPE_COLORS[record.file_type] ?? "#1A9BA1"; // file-type accent
  const badgeClass =
    FORMAT_BADGE_CLASSES[record.output_format] ?? "bg-slate-100 text-slate-700";
  const isChained = record.file_name.includes("→");

  return (
    <div className="flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-slate-50">
      <span
        className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: dotColor }}
      />

      <div className="min-w-0 flex-1">
        <p
          className={`flex max-w-[180px] items-center truncate text-sm font-medium ${
            isChained ? "text-gray-600 italic" : "text-gray-900"
          }`}
        >
          {isChained ? (
            <TbLink
              className="mr-1 shrink-0 text-xs text-[#4BBFC4]"
              aria-hidden="true"
            />
          ) : null}
          {record.file_name}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {formatRelativeTime(record.created_at)}
        </p>
        <span
          className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${badgeClass}`}
        >
          {FORMAT_LABELS[record.output_format] ?? record.output_format}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label="Yeniden indir"
          onClick={() =>
            downloadConvertedFile(
              record.file_name,
              record.output_format,
              record.converted_result,
            )
          }
          className="rounded p-1 text-gray-400 transition-colors hover:text-brand-teal"
        >
          <TbDownload size={14} />
        </button>
        <button
          type="button"
          aria-label="Sil"
          onClick={() => onDelete(record.id)}
          className="rounded p-1 text-gray-400 transition-colors hover:text-red-400"
        >
          <TbTrash size={14} />
        </button>
      </div>
    </div>
  );
}
