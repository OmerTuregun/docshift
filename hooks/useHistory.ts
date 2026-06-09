"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  clearAnonHistory,
  deleteAnonHistoryItem,
  getAnonHistory,
} from "@/lib/anonHistory";
import type { ConversionRecord } from "@/lib/db/history";
import { HISTORY_UPDATED_EVENT } from "@/lib/historyEvents";

export function useHistory(isOpen: boolean) {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mergedRef = useRef(false);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!session?.user?.id) {
        setHistory(getAnonHistory());
        return;
      }

      const response = await fetch("/api/history");

      if (!response.ok) {
        throw new Error("Geçmiş yüklenemedi");
      }

      const data = (await response.json()) as ConversionRecord[];
      setHistory(data);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Geçmiş yüklenemedi";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  const mergeOnLogin = useCallback(async () => {
    const anonRecords = getAnonHistory();

    if (!session?.user?.id || anonRecords.length === 0) {
      return;
    }

    try {
      await fetch("/api/history/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          records: anonRecords.map(
            ({ file_name, file_type, output_format, converted_result, created_at }) => ({
              file_name,
              file_type,
              output_format,
              converted_result,
              created_at,
            }),
          ),
        }),
      });

      clearAnonHistory();
    } catch {
      // Keep local records if merge fails; user can retry on next login.
    }
  }, [session?.user?.id]);

  const deleteItem = useCallback(
    async (id: string) => {
      const previous = history;
      setHistory((items) => items.filter((item) => item.id !== id));

      try {
        if (!session?.user?.id) {
          deleteAnonHistoryItem(id);
          return;
        }

        const response = await fetch(`/api/history?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Kayıt silinemedi");
        }
      } catch {
        setHistory(previous);
        await fetchHistory();
      }
    },
    [fetchHistory, history, session?.user?.id],
  );

  useEffect(() => {
    if (!isOpen || status === "loading") return;
    void fetchHistory();
  }, [fetchHistory, isOpen, status]);

  useEffect(() => {
    if (status !== "authenticated" || mergedRef.current) return;

    mergedRef.current = true;
    void mergeOnLogin().then(() => fetchHistory());
  }, [fetchHistory, mergeOnLogin, status]);

  useEffect(() => {
    const handleHistoryUpdated = () => {
      void fetchHistory();
    };

    window.addEventListener(HISTORY_UPDATED_EVENT, handleHistoryUpdated);
    return () =>
      window.removeEventListener(HISTORY_UPDATED_EVENT, handleHistoryUpdated);
  }, [fetchHistory]);

  return {
    history,
    isLoading,
    error,
    deleteItem,
    refetch: fetchHistory,
  };
}
