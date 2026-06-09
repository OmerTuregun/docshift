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
}

export default function OutputFormatSelector({
  value,
  onChange,
}: OutputFormatSelectorProps) {
  return (
    <div className="flex w-full justify-center">
      <div className="flex gap-1 rounded-xl bg-white/20 p-1">
        {FORMATS.map(({ value: formatValue, label }) => {
          const isActive = value === formatValue;

          return (
            <button
              key={formatValue}
              type="button"
              onClick={() => onChange(formatValue)}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? "bg-white font-medium text-brand-navy shadow-sm"
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
