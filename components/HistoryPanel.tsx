"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TbHistory, TbX } from "react-icons/tb";
import HistoryItem from "@/components/HistoryItem";
import { useHistory } from "@/hooks/useHistory";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function HistorySkeleton() {
  return (
    <div className="space-y-3 px-4 py-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-lg bg-slate-100 px-3 py-4"
        >
          <div className="mb-2 h-3 w-2/3 rounded bg-slate-200" />
          <div className="h-2 w-1/3 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export default function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const { history, isLoading, error, deleteItem, refetch } = useHistory(isOpen);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Geçmiş panelini kapat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[55] bg-black/20"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 z-[60] flex h-full w-80 flex-col border-l border-brand-teal/20 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-brand-teal px-4 py-4">
              <h2 className="text-lg font-semibold text-brand-navy">
                Dönüşüm Geçmişi
              </h2>
              <button
                type="button"
                aria-label="Kapat"
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-slate-100 hover:text-gray-700"
              >
                <TbX size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? <HistorySkeleton /> : null}

              {!isLoading && error ? (
                <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
                  <p className="text-sm text-red-500">{error}</p>
                  <button
                    type="button"
                    onClick={() => void refetch()}
                    className="rounded-lg bg-brand-teal px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy"
                  >
                    Tekrar dene
                  </button>
                </div>
              ) : null}

              {!isLoading && !error && history.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-4 py-16 text-center text-gray-500">
                  <TbHistory size={32} className="text-brand-teal" />
                  <p className="text-sm">Henüz dönüşüm yok</p>
                </div>
              ) : null}

              {!isLoading && !error && history.length > 0 ? (
                <div className="divide-y divide-slate-100 py-2">
                  {history.map((record) => (
                    <HistoryItem
                      key={record.id}
                      record={record}
                      onDelete={deleteItem}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
