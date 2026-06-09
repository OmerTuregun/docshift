export const HISTORY_UPDATED_EVENT = "history:updated";

export function dispatchHistoryUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(HISTORY_UPDATED_EVENT));
}
