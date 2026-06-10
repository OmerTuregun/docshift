"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { clearAnonHistory, getAnonHistory } from "@/lib/anonHistory";
import { dispatchHistoryUpdated } from "@/lib/historyEvents";

export default function MergeAnonHistory() {
  const { status } = useSession();
  const mergedRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || mergedRef.current) {
      return;
    }

    const records = getAnonHistory();
    if (records.length === 0) {
      return;
    }

    mergedRef.current = true;

    void (async () => {
      try {
        const response = await fetch("/api/history/merge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ records }),
        });

        if (!response.ok) {
          mergedRef.current = false;
          return;
        }

        clearAnonHistory();
        dispatchHistoryUpdated();
      } catch {
        mergedRef.current = false;
      }
    })();
  }, [status]);

  return null;
}
