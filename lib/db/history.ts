import { randomUUID } from "crypto";
import { pool } from "@/lib/db/pool";

export interface ConversionRecord {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  output_format: string;
  converted_result: string;
  created_at: string;
}

interface SaveConversionInput {
  userId: string;
  fileName: string;
  fileType: string;
  outputFormat: string;
  convertedResult: string;
}

function mapRow(row: Record<string, unknown>): ConversionRecord {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    file_name: String(row.file_name),
    file_type: String(row.file_type),
    output_format: String(row.output_format),
    converted_result: String(row.converted_result ?? ""),
    created_at: new Date(String(row.created_at)).toISOString(),
  };
}

export async function saveConversion({
  userId,
  fileName,
  fileType,
  outputFormat,
  convertedResult,
}: SaveConversionInput): Promise<void> {
  await pool.query(
    `INSERT INTO conversion_history
      (id, user_id, file_name, file_type, output_format, converted_result)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [randomUUID(), userId, fileName, fileType, outputFormat, convertedResult],
  );
}

export async function getUserHistory(
  userId: string,
  limit = 20,
): Promise<ConversionRecord[]> {
  const result = await pool.query(
    `SELECT id, user_id, file_name, file_type, output_format, converted_result, created_at
     FROM conversion_history
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit],
  );

  return result.rows.map(mapRow);
}

export async function deleteHistoryItem(
  id: string,
  userId: string,
): Promise<void> {
  await pool.query(
    `DELETE FROM conversion_history
     WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );
}

export async function bulkInsertHistory(
  userId: string,
  records: Array<{
    id: string;
    file_name: string;
    file_type: string;
    output_format: string;
    converted_result: string;
    created_at?: string;
  }>,
): Promise<number> {
  let merged = 0;

  for (const record of records.slice(0, 5)) {
    const result = await pool.query(
      `INSERT INTO conversion_history
        (id, user_id, file_name, file_type, output_format, converted_result, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, NOW()))
       ON CONFLICT (id) DO NOTHING`,
      [
        record.id,
        userId,
        record.file_name,
        record.file_type,
        record.output_format,
        record.converted_result,
        record.created_at ?? null,
      ],
    );

    if ((result.rowCount ?? 0) > 0) {
      merged += 1;
    }
  }

  return merged;
}
