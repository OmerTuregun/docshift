"use client";

import { TbKey, TbTrash } from "react-icons/tb";
import type { ApiKey } from "@/lib/db/apiKeys";
import { formatRelativeTime } from "@/lib/formatRelativeTime";

interface ApiKeyRowProps {
  apiKey: ApiKey;
  onDelete: (id: string) => void;
}

export default function ApiKeyRow({ apiKey, onDelete }: ApiKeyRowProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#d0f0f2]">
        <TbKey className="text-[#1A9BA1]" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <span className="text-sm font-medium text-[#1D3461]">
            {apiKey.name}
          </span>
          <span className="rounded-full bg-[#EAF3DE] px-2 py-0.5 text-[10px] text-[#3B6D11]">
            Aktif
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <code className="font-mono text-xs text-gray-400">
            {apiKey.key_prefix}
          </code>
          <span className="text-gray-200">·</span>
          <span className="text-xs text-gray-400">
            {apiKey.usage_count ?? 0} istek
          </span>
          <span className="text-gray-200">·</span>
          <span className="text-xs text-gray-400">
            {apiKey.last_used_at
              ? formatRelativeTime(apiKey.last_used_at)
              : "Hiç kullanılmadı"}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(apiKey.id)}
        className="rounded-lg p-2 text-gray-300 transition-all duration-150 hover:bg-red-50 hover:text-red-400"
        aria-label="Key'i sil"
      >
        <TbTrash className="text-base" />
      </button>
    </div>
  );
}
