"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { TbHistory, TbLogout, TbRefresh, TbX } from "react-icons/tb";
import HistoryItem from "@/components/HistoryItem";
import ReconvertModal from "@/components/ReconvertModal";
import { showToast } from "@/components/Toast";
import { useHistory } from "@/hooks/useHistory";
import type { OutputFormat } from "@/lib/converters";
import type { ConversionRecord } from "@/lib/db/history";
import { groupHistoryByDate } from "@/lib/groupHistoryByDate";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onReconvert: (
    record: ConversionRecord,
    toFormat: OutputFormat,
  ) => Promise<void>;
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
    <div className="space-y-4 px-2 py-3">
      {["Bugün", "Bu hafta"].map((label) => (
        <div key={label}>
          <div className="mb-2 h-3 w-16 animate-pulse rounded bg-gray-100" />
          {[1, 2].map((index) => (
            <div key={index} className="flex items-center gap-3 py-2.5">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-100" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-2 w-1/2 animate-pulse rounded bg-gray-50" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function HistoryDrawer({
  isOpen,
  onClose,
  onReconvert,
}: HistoryDrawerProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { history, isLoading, error, deleteItem, refetch } = useHistory(isOpen);
  const [reconvertRecord, setReconvertRecord] =
    useState<ConversionRecord | null>(null);
  const [isReconverting, setIsReconverting] = useState(false);

  const handleReconvert = useCallback((record: ConversionRecord) => {
    setReconvertRecord(record);
  }, []);

  const handleReconvertConfirm = useCallback(
    async (record: ConversionRecord, toFormat: OutputFormat) => {
      setIsReconverting(true);

      try {
        await onReconvert(record, toFormat);
        setReconvertRecord(null);
        onClose();
        showToast("Dönüşüm başlatıldı", "success");
      } catch {
        showToast("Dönüşüm başarısız", "error");
      } finally {
        setIsReconverting(false);
      }
    },
    [onClose, onReconvert],
  );

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

  const groupedHistory = groupHistoryByDate(history);

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
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <div>
            <h2 className="text-sm font-medium text-[#1D3461]">
              Dönüşüm Geçmişi
            </h2>
            <p className="mt-0.5 text-[10px] text-gray-400">
              {history.length} dönüşüm
            </p>
          </div>
          <button
            type="button"
            aria-label="Kapat"
            onClick={onClose}
            className="rounded-lg p-1.5 transition hover:bg-gray-100"
          >
            <TbX className="text-sm text-gray-400" />
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

        <div className="flex-1 overflow-y-auto px-2 py-2">
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
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                <TbHistory className="text-2xl text-gray-200" />
              </div>
              <p className="mb-1 text-sm font-medium text-gray-400">
                Henüz dönüşüm yok
              </p>
              <p className="text-xs leading-relaxed text-gray-300">
                Bir dosya yükleyerek başlayın
              </p>
            </div>
          ) : null}

          {!isLoading && !error && history.length > 0 ? (
            <div className="space-y-4">
              {groupedHistory.map((group) => (
                <div key={group.label}>
                  <div className="mb-1 flex items-center gap-2 px-2">
                    <span className="text-[10px] font-medium tracking-wider text-gray-300 uppercase">
                      {group.label}
                    </span>
                    <div className="h-px flex-1 bg-gray-100" />
                    <span className="text-[10px] text-gray-300">
                      {group.records.length}
                    </span>
                  </div>

                  {group.records.map((record) => (
                    <HistoryItem
                      key={record.id}
                      record={record}
                      onDelete={deleteItem}
                      onReconvert={handleReconvert}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {isAuthenticated && session?.user && history.length > 0 ? (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "Kullanıcı"}
                  width={28}
                  height={28}
                  className="h-7 w-7 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1D3461] text-xs text-white">
                  {getInitials(session.user.name, session.user.email)}
                </div>
              )}
              <span className="max-w-[100px] truncate text-xs text-gray-500">
                {session.user.name ?? session.user.email ?? "Kullanıcı"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-300">
                {history.length} kayıt
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1 text-[10px] text-gray-400 transition-colors hover:text-red-400"
              >
                <TbLogout className="text-[10px]" />
                Çıkış
              </button>
            </div>
          </div>
        ) : null}
      </motion.div>

      <ReconvertModal
        record={reconvertRecord}
        onClose={() => setReconvertRecord(null)}
        onConfirm={(record, toFormat) => {
          void handleReconvertConfirm(record, toFormat);
        }}
        isLoading={isReconverting}
      />
    </>
  );
}
