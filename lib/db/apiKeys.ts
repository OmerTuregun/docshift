import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import pool from "@/lib/db/pool";

export type ApiKey = {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  created_at: string;
  is_active: boolean;
  usage_count?: number;
};

function mapApiKey(row: Record<string, unknown>): ApiKey {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    name: String(row.name),
    key_prefix: String(row.key_prefix),
    last_used_at: row.last_used_at
      ? new Date(String(row.last_used_at)).toISOString()
      : null,
    created_at: new Date(String(row.created_at)).toISOString(),
    is_active: Boolean(row.is_active),
    usage_count: row.usage_count ? Number(row.usage_count) : 0,
  };
}

export async function generateApiKey(
  userId: string,
  name: string,
): Promise<{ key: string; record: ApiKey }> {
  const key = `ds_live_${randomUUID().replace(/-/g, "")}`;
  const keyPrefix = `${key.slice(0, 12)}...`;
  const keyHash = await bcrypt.hash(key, 10);

  const result = await pool.query(
    `INSERT INTO api_keys (user_id, name, key_hash, key_prefix)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, name, key_prefix, last_used_at, created_at, is_active`,
    [Number(userId), name, keyHash, keyPrefix],
  );

  return {
    key,
    record: mapApiKey({ ...result.rows[0], usage_count: 0 }),
  };
}

export async function getUserApiKeys(userId: string): Promise<ApiKey[]> {
  const result = await pool.query(
    `SELECT api_keys.id,
            api_keys.user_id,
            api_keys.name,
            api_keys.key_prefix,
            api_keys.last_used_at,
            api_keys.created_at,
            api_keys.is_active,
            COUNT(api_key_usage.id) AS usage_count
     FROM api_keys
     LEFT JOIN api_key_usage ON api_keys.id = api_key_usage.api_key_id
     WHERE api_keys.user_id = $1 AND api_keys.is_active = true
     GROUP BY api_keys.id
     ORDER BY api_keys.created_at DESC`,
    [Number(userId)],
  );

  return result.rows.map(mapApiKey);
}

export async function countActiveApiKeys(userId: string): Promise<number> {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM api_keys
     WHERE user_id = $1 AND is_active = true`,
    [Number(userId)],
  );

  return Number(result.rows[0]?.count ?? 0);
}

export async function deleteApiKey(id: string, userId: string): Promise<void> {
  await pool.query(
    `UPDATE api_keys
     SET is_active = false
     WHERE id = $1 AND user_id = $2`,
    [id, Number(userId)],
  );
}

export async function validateApiKey(
  rawKey: string,
): Promise<{ valid: boolean; keyId?: string; userId?: string }> {
  const prefix = `${rawKey.slice(0, 12)}...`;

  const result = await pool.query(
    `SELECT id, user_id, key_hash
     FROM api_keys
     WHERE key_prefix = $1 AND is_active = true`,
    [prefix],
  );

  for (const row of result.rows) {
    const matches = await bcrypt.compare(rawKey, String(row.key_hash));

    if (matches) {
      await pool.query(
        `UPDATE api_keys SET last_used_at = NOW() WHERE id = $1`,
        [row.id],
      );

      return {
        valid: true,
        keyId: String(row.id),
        userId: String(row.user_id),
      };
    }
  }

  return { valid: false };
}

export async function getApiKeyUsageCountLastHour(
  apiKeyId: string,
): Promise<number> {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM api_key_usage
     WHERE api_key_id = $1
       AND created_at > NOW() - INTERVAL '1 hour'`,
    [apiKeyId],
  );

  return Number(result.rows[0]?.count ?? 0);
}

export async function logApiKeyUsage(
  apiKeyId: string,
  endpoint: string,
  fileType: string,
  outputFormat: string,
  statusCode: number,
): Promise<void> {
  await pool.query(
    `INSERT INTO api_key_usage
      (api_key_id, endpoint, file_type, output_format, status_code)
     VALUES ($1, $2, $3, $4, $5)`,
    [apiKeyId, endpoint, fileType, outputFormat, statusCode],
  );
}
