"use client";

import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
} from "react";
import { useHistory } from "@/hooks/useHistory";
import type { ConversionRecord } from "@/lib/db/history";
import { searchStaticItems, type SearchItem } from "@/lib/searchSources";
import type { FileType } from "@/types";

export type SearchResult = SearchItem & {
  historyRecord?: ConversionRecord;
};

const HISTORY_ICON: Record<FileType, string> = {
  excel: "ti-table",
  word: "ti-file-text",
  pdf: "ti-file-type-pdf",
  powerpoint: "ti-presentation",
};

const HISTORY_ICON_BG: Record<FileType, string> = {
  excel: "bg-[#217346]",
  word: "bg-[#2B579A]",
  pdf: "bg-[#F40F02]",
  powerpoint: "bg-[#D24726]",
};

function mapHistoryToResults(
  history: ConversionRecord[],
  query: string,
): SearchResult[] {
  const q = query.toLowerCase();

  return history
    .filter(
      (record) =>
        record.file_name.toLowerCase().includes(q) ||
        record.output_format.toLowerCase().includes(q) ||
        record.file_type.toLowerCase().includes(q),
    )
    .slice(0, 5)
    .map((record) => {
      const fileType = record.file_type as FileType;

      return {
        id: `history-${record.id}`,
        type: "history" as const,
        title: record.file_name,
        subtitle: `${record.output_format.toUpperCase()} · ${record.file_type}`,
        icon: HISTORY_ICON[fileType] ?? "ti-file",
        iconBg: HISTORY_ICON_BG[fileType] ?? "bg-gray-400",
        iconColor: "text-white",
        action: "open-history" as const,
        historyRecord: record,
      };
    });
}

export function useSmartSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { history } = useHistory(true);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    const q = query.toLowerCase().trim();
    const staticResults = searchStaticItems(q);
    const historyResults = mapHistoryToResults(history, q);
    const combined = [...historyResults, ...staticResults].slice(0, 8);

    setResults(combined);
    setIsOpen(combined.length > 0);
    setActiveIndex(-1);
  }, [query, history]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): SearchResult | undefined => {
      if (!isOpen) {
        return undefined;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) =>
          index < results.length - 1 ? index + 1 : 0,
        );
        return undefined;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) =>
          index > 0 ? index - 1 : results.length - 1,
        );
        return undefined;
      }

      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        setActiveIndex(-1);
        return undefined;
      }

      if (event.key === "Enter" && activeIndex >= 0) {
        event.preventDefault();
        return results[activeIndex];
      }

      return undefined;
    },
    [activeIndex, isOpen, results],
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  return {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    clearSearch,
  };
}
