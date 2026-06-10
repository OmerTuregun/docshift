"use client";

const STORAGE_KEY = "docshift_session_count";
export const CONVERSION_DONE_EVENT = "conversion:done";

export function incrementSessionCount(): void {
  if (typeof window === "undefined") return;

  const current = getSessionCount();
  window.localStorage.setItem(STORAGE_KEY, String(current + 1));
  window.dispatchEvent(new CustomEvent(CONVERSION_DONE_EVENT));
}

export function getSessionCount(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = Number.parseInt(raw ?? "0", 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}
