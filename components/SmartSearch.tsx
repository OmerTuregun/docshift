"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { TbSearch, TbSearchOff, TbX } from "react-icons/tb";
import SearchResultItem from "@/components/SearchResultItem";
import {
  useSmartSearch,
  type SearchResult,
} from "@/hooks/useSmartSearch";
import { navigateToSection } from "@/lib/scrollToSection";

interface SmartSearchProps {
  onOpenHistory: () => void;
  className?: string;
}

export default function SmartSearch({
  onOpenHistory,
  className = "",
}: SmartSearchProps) {
  const {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    clearSearch,
  } = useSmartSearch();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setIsOpen]);

  useEffect(() => {
    const handler = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        if (query) {
          setIsOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [query, setIsOpen]);

  const handleSelect = (result: SearchResult) => {
    switch (result.action) {
      case "scroll": {
        clearSearch();
        navigateToSection(`#${result.payload ?? ""}`, pathname, router);
        break;
      }
      case "open-history":
        clearSearch();
        onOpenHistory();
        break;
      case "navigate":
        clearSearch();
        router.push(result.payload ?? "/");
        break;
    }
  };

  const handleKeyDownWrapper = (event: KeyboardEvent<HTMLInputElement>) => {
    const selected = handleKeyDown(event);
    if (selected) {
      handleSelect(selected);
    }
  };

  const historyResults = results.filter((result) => result.type === "history");
  const staticResults = results.filter((result) => result.type !== "history");

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex w-48 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition-all duration-150 focus-within:w-64 focus-within:border-[#1A9BA1] focus-within:bg-white hover:bg-gray-100">
        <TbSearch className="shrink-0 text-sm text-gray-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (event.target.value) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDownWrapper}
          onFocus={() => {
            if (query) {
              setIsOpen(true);
            }
          }}
          placeholder="Ara..."
          aria-label="Ara"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          className="w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
        />
        {query ? (
          <button
            type="button"
            onClick={clearSearch}
            className="text-gray-300 hover:text-gray-500"
            aria-label="Aramayı temizle"
          >
            <TbX className="text-xs" />
          </button>
        ) : (
          <kbd className="hidden items-center rounded border border-gray-200 px-1 py-0.5 font-mono text-[9px] text-gray-300 sm:flex">
            ⌘K
          </kbd>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 left-0 z-50 mt-1.5 min-w-[280px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg"
            role="listbox"
          >
            {historyResults.length > 0 ? (
              <div className="px-3 pt-2.5 pb-1 text-[9px] font-medium tracking-wider text-gray-300 uppercase">
                Geçmiş
              </div>
            ) : null}

            {historyResults.map((result, index) => (
              <SearchResultItem
                key={result.id}
                result={result}
                isActive={activeIndex === index}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setActiveIndex(index)}
              />
            ))}

            {staticResults.length > 0 ? (
              <div className="border-t border-gray-50 px-3 pt-2.5 pb-1 text-[9px] font-medium tracking-wider text-gray-300 uppercase">
                Öneriler
              </div>
            ) : null}

            {staticResults.map((result, index) => {
              const globalIndex = historyResults.length + index;

              return (
                <SearchResultItem
                  key={result.id}
                  result={result}
                  isActive={activeIndex === globalIndex}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setActiveIndex(globalIndex)}
                />
              );
            })}

            <div className="flex items-center gap-3 border-t border-gray-50 px-3 py-2">
              <span className="flex items-center gap-1 text-[9px] text-gray-300">
                <kbd className="rounded border border-gray-200 px-1 font-mono text-[8px]">
                  ↑↓
                </kbd>
                gezin
              </span>
              <span className="flex items-center gap-1 text-[9px] text-gray-300">
                <kbd className="rounded border border-gray-200 px-1 font-mono text-[8px]">
                  ↵
                </kbd>
                seç
              </span>
              <span className="flex items-center gap-1 text-[9px] text-gray-300">
                <kbd className="rounded border border-gray-200 px-1 font-mono text-[8px]">
                  Esc
                </kbd>
                kapat
              </span>
            </div>
          </motion.div>
        ) : null}

        {isOpen && query && results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full right-0 left-0 z-50 mt-1.5 min-w-[280px] rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-lg"
          >
            <TbSearchOff className="mx-auto mb-2 block text-2xl text-gray-200" />
            <p className="text-xs font-medium text-gray-400">Sonuç bulunamadı</p>
            <p className="mt-1 text-[10px] text-gray-300">
              &quot;{query}&quot; için eşleşme yok
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
