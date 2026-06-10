"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TbChevronDown } from "react-icons/tb";

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: FaqItemProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 transition-all duration-200">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-150 hover:bg-gray-50"
        aria-expanded={isOpen}
      >
        <span className="pr-4 text-sm font-medium text-[#1D3461]">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <TbChevronDown className="text-base text-[#1A9BA1]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="border-t border-gray-100 px-5 pt-0 pb-4">
              <p className="pt-3 text-xs leading-relaxed text-gray-400">
                {answer}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
