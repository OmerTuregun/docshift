"use client";

import type { OutputFormat } from "@/lib/converters";

const FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "markdown", label: "Markdown" },
  { value: "plaintext", label: "Plain Text" },
];

interface OutputFormatSelectorProps {
  value: OutputFormat;
  onChange: (format: OutputFormat) => void;
  variant?: "card" | "inline";
}

export default function OutputFormatSelector({
  value,
  onChange,
  variant = "card",
}: OutputFormatSelectorProps) {
  const isInline = variant === "inline";

  return (
    <div className="flex w-full justify-center">
      <div
        className={`flex gap-1 rounded-xl p-1 ${
          isInline ? "border border-gray-200 bg-gray-50" : "bg-white/20"
        }`}
      >
        {FORMATS.map(({ value: formatValue, label }) => {
          const isActive = value === formatValue;

          return (
            <button
              key={formatValue}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onChange(formatValue);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? isInline
                    ? "bg-brand-teal font-medium text-white shadow-sm"
                    : "bg-white font-medium text-brand-navy shadow-sm"
                  : isInline
                    ? "text-gray-500 hover:text-brand-navy"
                    : "text-white/60 hover:text-white/90"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
