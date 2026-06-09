import type { ConversionRecord } from "@/lib/db/history";

const STORAGE_KEY = "docshift_anon_history";
const MAX_ITEMS = 5;

export type AnonConversionInput = Omit<ConversionRecord, "id" | "user_id">;

function readStorage(): ConversionRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as ConversionRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(records: ConversionRecord[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function saveAnonConversion(
  record: AnonConversionInput,
): ConversionRecord {
  const items = readStorage();
  const newRecord: ConversionRecord = {
    ...record,
    id: crypto.randomUUID(),
    user_id: "anon",
    created_at: record.created_at || new Date().toISOString(),
  };

  items.unshift(newRecord);

  if (items.length > MAX_ITEMS) {
    items.length = MAX_ITEMS;
  }

  writeStorage(items);
  return newRecord;
}

export function getAnonHistory(): ConversionRecord[] {
  return readStorage();
}

export function deleteAnonHistoryItem(id: string): void {
  const items = readStorage().filter((item) => item.id !== id);
  writeStorage(items);
}

export function clearAnonHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
