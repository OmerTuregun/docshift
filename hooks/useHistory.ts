"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  deleteAnonHistoryItem,
  getAnonHistory,
  type AnonRecord,
} from "@/lib/anonHistory";
import type { ConversionRecord } from "@/lib/db/history";
import { HISTORY_UPDATED_EVENT } from "@/lib/historyEvents";

function toConversionRecord(record: AnonRecord): ConversionRecord {
  return {
    ...record,
    user_id: "anon",
  };
}

export function useHistory(isOpen: boolean) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnonHistory = useCallback(() => {
    setHistory(getAnonHistory().map(toConversionRecord));
  }, []);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isAuthenticated) {
        loadAnonHistory();
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
  }, [isAuthenticated, loadAnonHistory]);

  const deleteItem = useCallback(
    async (id: string) => {
      const previous = history;
      setHistory((items) => items.filter((item) => item.id !== id));

      try {
        if (!isAuthenticated) {
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
    [fetchHistory, history, isAuthenticated],
  );

  useEffect(() => {
    if (!isOpen || status === "loading") return;

    const timer = window.setTimeout(() => {
      void fetchHistory();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchHistory, isOpen, status]);

  useEffect(() => {
    const handleHistoryUpdated = () => {
      if (isAuthenticated) {
        void fetchHistory();
      } else {
        loadAnonHistory();
      }
    };

    window.addEventListener(HISTORY_UPDATED_EVENT, handleHistoryUpdated);
    return () =>
      window.removeEventListener(HISTORY_UPDATED_EVENT, handleHistoryUpdated);
  }, [fetchHistory, isAuthenticated, loadAnonHistory]);

  return {
    history,
    isLoading,
    error,
    deleteItem,
    refetch: fetchHistory,
  };
}
