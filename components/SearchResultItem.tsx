"use client";

import type { SearchResult } from "@/hooks/useSmartSearch";
import { getSearchIcon } from "@/lib/searchIcons";

interface SearchResultItemProps {
  result: SearchResult;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

function getTypeLabel(type: SearchResult["type"]): string {
  switch (type) {
    case "history":
      return "geçmiş";
    case "format":
      return "format";
    case "filetype":
      return "dosya";
    default:
      return "işlem";
  }
}

export default function SearchResultItem({
  result,
  isActive,
  onClick,
  onMouseEnter,
}: SearchResultItemProps) {
  const Icon = getSearchIcon(result.icon);

  return (
    <div
      role="option"
      aria-selected={isActive}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors duration-100 ${
        isActive ? "bg-[#d0f0f2]" : "hover:bg-gray-50"
      }`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${result.iconBg}`}
      >
        <Icon className={`text-xs ${result.iconColor}`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium text-gray-700">
          {result.title}
        </div>
        {result.subtitle ? (
          <div className="mt-0.5 truncate text-[10px] text-gray-400">
            {result.subtitle}
          </div>
        ) : null}
      </div>

      <span className="shrink-0 text-[9px] tracking-wider text-gray-300 uppercase">
        {getTypeLabel(result.type)}
      </span>
    </div>
  );
}
