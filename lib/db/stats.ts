import { unstable_cache } from "next/cache";
import pool from "@/lib/db/pool";

const TOTAL_CONVERSIONS_KEY = "total_conversions";

export async function incrementConversionCount(): Promise<void> {
  await pool.query(
    `UPDATE global_stats
     SET value = value + 1
     WHERE key = $1`,
    [TOTAL_CONVERSIONS_KEY],
  );
}

async function queryConversionCount(): Promise<number> {
  const result = await pool.query(
    `SELECT value FROM global_stats WHERE key = $1`,
    [TOTAL_CONVERSIONS_KEY],
  );

  if (result.rowCount === 0) {
    return 0;
  }

  return Number(result.rows[0].value ?? 0);
}

export const getConversionCount = unstable_cache(
  queryConversionCount,
  ["conversion-count"],
  { revalidate: 30 },
);
