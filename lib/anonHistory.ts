"use client";

const STORAGE_KEY = "docshift_anon_history";
const MAX_ITEMS = 5;

export type AnonRecord = {
  id: string;
  file_name: string;
  file_type: string;
  output_format: string;
  converted_result: string;
  created_at: string;
};

function readStorage(): AnonRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as AnonRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(records: AnonRecord[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function saveAnonConversion(record: Omit<AnonRecord, "id">): void {
  const items = readStorage();
  const newRecord: AnonRecord = {
    ...record,
    id: crypto.randomUUID(),
    created_at: record.created_at || new Date().toISOString(),
  };

  items.unshift(newRecord);

  if (items.length > MAX_ITEMS) {
    items.length = MAX_ITEMS;
  }

  writeStorage(items);
}

export function getAnonHistory(): AnonRecord[] {
  return readStorage();
}

export function deleteAnonHistoryItem(id: string): void {
  writeStorage(readStorage().filter((item) => item.id !== id));
}

export function clearAnonHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
