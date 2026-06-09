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
    <div className="mb-2 flex w-full justify-center">
      <div className="inline-flex rounded-full border border-white/20 bg-black/20 p-1">
        {FORMATS.map(({ value: formatValue, label }) => {
          const isActive = value === formatValue;

          return (
            <button
              key={formatValue}
              type="button"
              onClick={() => onChange(formatValue)}
              className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                isActive
                  ? "bg-white font-bold text-gray-900 shadow"
                  : "bg-transparent font-medium text-white/70 hover:text-white"
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
