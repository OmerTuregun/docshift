"use client";

import { Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TbX } from "react-icons/tb";
import { SHORTCUTS } from "@/lib/shortcuts";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GROUPS = [
  {
    label: "Navigasyon",
    actions: ["search", "history", "close", "help"],
  },
  {
    label: "Dönüşüm",
    actions: ["copy-last", "download-last", "download-all"],
  },
] as const;

export default function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 z-[71] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-base font-medium text-[#1D3461]">
                  Klavye Kısayolları
                </h2>
                <p className="mt-1 text-xs text-gray-400">
                  Hızlı işlemler için kısayolları kullanın
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 transition hover:bg-gray-100"
                aria-label="Kapat"
              >
                <TbX className="text-sm text-gray-400" />
              </button>
            </div>

            <div className="space-y-5">
              {GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 text-[10px] font-medium tracking-wider text-gray-300 uppercase">
                    {group.label}
                  </p>

                  <div className="space-y-1">
                    {SHORTCUTS.filter((shortcut) =>
                      group.actions.includes(shortcut.action),
                    ).map((shortcut) => (
                      <div
                        key={shortcut.action}
                        className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-gray-50"
                      >
                        <span className="text-sm text-gray-600">
                          {shortcut.description}
                        </span>

                        <div className="flex items-center gap-1">
                          {shortcut.label.split(" + ").map((key, index, arr) => (
                            <Fragment key={`${shortcut.action}-${key}`}>
                              <kbd className="min-w-[24px] rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-center font-mono text-[10px] text-gray-500">
                                {key}
                              </kbd>
                              {index < arr.length - 1 ? (
                                <span className="text-xs text-gray-300">+</span>
                              ) : null}
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4 text-center">
              <p className="text-[10px] text-gray-300">
                Mac&apos;te Ctrl yerine ⌘ Cmd kullanın
              </p>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
