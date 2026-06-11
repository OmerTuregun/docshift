"use client";

import { TbCode, TbEye } from "react-icons/tb";
import type { OutputFormat } from "@/lib/converters";

interface PreviewToggleProps {
  mode: "raw" | "preview";
  onChange: (mode: "raw" | "preview") => void;
  format: OutputFormat;
}

export default function PreviewToggle({
  mode,
  onChange,
  format,
}: PreviewToggleProps) {
  if (format !== "json" && format !== "markdown") {
    return null;
  }

  return (
    <div className="flex items-center gap-1 rounded-lg bg-white/10 p-0.5">
      {(["raw", "preview"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs transition-all duration-150 ${
            mode === m
              ? "bg-white font-medium text-[#1D3461] shadow-sm"
              : "text-white/50 hover:text-white/80"
          }`}
        >
          {m === "raw" ? (
            <TbCode className="text-xs" />
          ) : (
            <TbEye className="text-xs" />
          )}
          {m === "raw" ? "Ham" : "Önizleme"}
        </button>
      ))}
    </div>
  );
}
