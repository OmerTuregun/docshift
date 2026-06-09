const SESSION_COUNT_KEY = "docshift_session_count";

export const STATS_UPDATED_EVENT = "stats:updated";

export function getSessionCount(): number {
  if (typeof window === "undefined") return 0;

  const value = window.localStorage.getItem(SESSION_COUNT_KEY);
  return value ? Number.parseInt(value, 10) || 0 : 0;
}

export function incrementSessionCount(): number {
  const next = getSessionCount() + 1;
  window.localStorage.setItem(SESSION_COUNT_KEY, String(next));
  window.dispatchEvent(new CustomEvent(STATS_UPDATED_EVENT));
  return next;
}
