"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import {
  TbHistory,
  TbLogout,
  TbRefresh,
  TbX,
} from "react-icons/tb";
import HistoryItem from "@/components/HistoryItem";
import { useHistory } from "@/hooks/useHistory";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (email?.[0] ?? "U").toUpperCase();
}

function HistorySkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-2 py-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-gray-200" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
            <div className="h-2.5 w-1/2 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </>
  );
}

export default function HistoryDrawer({ isOpen, onClose }: HistoryDrawerProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { history, isLoading, error, deleteItem, refetch } = useHistory(isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <motion.div
        key="history-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/25"
        onClick={onClose}
      />

      <motion.div
        key="history-drawer"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0, right: 0.5 }}
        onDragEnd={(_event, info) => {
          if (info.offset.x > 100) {
            onClose();
          }
        }}
        className="fixed top-0 right-0 z-50 flex h-full w-full flex-col bg-white shadow-xl sm:w-80"
        onClick={(event) => event.stopPropagation()}
      >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-medium text-[#1D3461]">
                Dönüşüm Geçmişi
              </h2>
              <button
                type="button"
                aria-label="Kapat"
                onClick={onClose}
                className="rounded-lg p-1.5 transition hover:bg-gray-100"
              >
                <TbX className="text-base text-gray-400" />
              </button>
            </div>

            {!isAuthenticated ? (
              <div className="border-b border-[#1A9BA1]/20 bg-[#d0f0f2] px-4 py-2.5">
                <p className="text-xs leading-relaxed text-[#1D3461]">
                  Son 5 dönüşümünüz gösteriliyor.{" "}
                  <Link
                    href="/auth/login?callbackUrl=/"
                    className="font-medium text-[#1A9BA1] underline"
                  >
                    Giriş yapın
                  </Link>{" "}
                  — tümünü saklayın.
                </p>
              </div>
            ) : null}

            <div className="flex-1 overflow-y-auto p-3">
              {isLoading ? <HistorySkeleton /> : null}

              {!isLoading && error ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <p className="text-xs text-red-400">Yüklenemedi</p>
                  <button
                    type="button"
                    onClick={() => void refetch()}
                    className="flex items-center gap-1 text-xs text-gray-500 transition hover:text-[#1D3461]"
                  >
                    <TbRefresh className="text-sm" />
                    Tekrar dene
                  </button>
                </div>
              ) : null}

              {!isLoading && !error && history.length === 0 ? (
                <div className="flex flex-col items-center py-12">
                  <TbHistory className="mb-3 text-4xl text-gray-200" />
                  <p className="text-sm text-gray-400">Henüz dönüşüm yok</p>
                  <p className="mt-1 text-xs text-gray-300">
                    Bir dosya yükleyerek başlayın
                  </p>
                </div>
              ) : null}

              {!isLoading && !error && history.length > 0 ? (
                <div className="divide-y divide-gray-100">
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

            {isAuthenticated && session?.user ? (
              <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
                <div className="flex min-w-0 items-center">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1D3461] text-xs text-white">
                    {getInitials(session.user.name, session.user.email)}
                  </div>
                  <span className="ml-2 max-w-[120px] truncate text-xs text-gray-500">
                    {session.user.name ?? session.user.email ?? "Kullanıcı"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-red-400"
                >
                  <TbLogout className="text-sm" />
                  Çıkış
                </button>
              </div>
            ) : null}
      </motion.div>
    </>
  );
}
