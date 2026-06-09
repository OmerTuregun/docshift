"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 right-4 z-[60] rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
