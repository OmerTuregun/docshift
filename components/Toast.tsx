"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TbAlertCircle, TbCheck, TbInfoCircle } from "react-icons/tb";

type ToastType = "success" | "error" | "info";

type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastShowDetail = {
  message: string;
  type?: ToastType;
  duration?: number;
};

export function showToast(
  message: string,
  type: ToastType = "info",
  duration = 3000,
) {
  window.dispatchEvent(
    new CustomEvent("toast:show", {
      detail: { message, type, duration },
    }),
  );
}

const ICONS: Record<ToastType, typeof TbInfoCircle> = {
  error: TbAlertCircle,
  success: TbCheck,
  info: TbInfoCircle,
};

const STYLES: Record<ToastType, string> = {
  error: "bg-red-500 text-white",
  success: "bg-[#1A9BA1] text-white",
  info: "bg-[#1D3461] text-white",
};

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleShow = (event: Event) => {
      const detail = (event as CustomEvent<ToastShowDetail>).detail;
      const toast: ToastMessage = {
        id: crypto.randomUUID(),
        message: detail.message,
        type: detail.type ?? "info",
        duration: detail.duration,
      };

      setToasts((prev) => [...prev, toast]);

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== toast.id));
      }, detail.duration ?? 3000);
    };

    window.addEventListener("toast:show", handleShow);
    return () => window.removeEventListener("toast:show", handleShow);
  }, []);

  return (
    <div className="pointer-events-none fixed right-5 bottom-5 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex max-w-sm items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${STYLES[toast.type]}`}
            >
              <Icon className="shrink-0 text-base" aria-hidden="true" />
              <span>{toast.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
