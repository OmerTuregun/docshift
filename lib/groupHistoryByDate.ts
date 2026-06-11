import type { ConversionRecord } from "@/lib/db/history";

export type HistoryGroup = {
  label: string;
  records: ConversionRecord[];
};

const GROUP_ORDER = [
  "Bugün",
  "Dün",
  "Bu hafta",
  "Bu ay",
  "Daha önce",
] as const;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getGroupLabel(
  createdAt: string,
  today: Date,
  yesterday: Date,
  thisWeek: Date,
  thisMonth: Date,
): (typeof GROUP_ORDER)[number] {
  const recordTime = new Date(createdAt).getTime();
  const todayTime = today.getTime();
  const yesterdayTime = yesterday.getTime();
  const thisWeekTime = thisWeek.getTime();
  const thisMonthTime = thisMonth.getTime();

  if (recordTime >= todayTime) {
    return "Bugün";
  }

  if (recordTime >= yesterdayTime) {
    return "Dün";
  }

  if (recordTime >= thisWeekTime) {
    return "Bu hafta";
  }

  if (recordTime >= thisMonthTime) {
    return "Bu ay";
  }

  return "Daha önce";
}

export function groupHistoryByDate(
  records: ConversionRecord[],
): HistoryGroup[] {
  const now = new Date();
  const today = startOfDay(now);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - 7);
  const thisMonth = new Date(today);
  thisMonth.setDate(thisMonth.getDate() - 30);

  const grouped = new Map<(typeof GROUP_ORDER)[number], ConversionRecord[]>();

  for (const record of records) {
    const label = getGroupLabel(
      record.created_at,
      today,
      yesterday,
      thisWeek,
      thisMonth,
    );
    const existing = grouped.get(label) ?? [];
    existing.push(record);
    grouped.set(label, existing);
  }

  return GROUP_ORDER.filter((label) => grouped.has(label)).map((label) => ({
    label,
    records: grouped.get(label)!,
  }));
}
