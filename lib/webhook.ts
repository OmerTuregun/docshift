import crypto from "node:crypto";
import pool from "@/lib/db/pool";

export type WebhookPayload = {
  event: "conversion.completed";
  timestamp: string;
  data: {
    file_name: string;
    file_type: string;
    output_format: string;
    converted_result: string;
    user_id: string;
  };
};

export type Webhook = {
  id: string;
  user_id: string;
  url: string;
  secret: string;
  is_active: boolean;
  created_at: string;
};

export type WebhookDelivery = {
  id: string;
  webhook_id: string;
  response_status: number | null;
  attempt_count: number;
  delivered_at: string | null;
  failed_at: string | null;
  created_at: string;
};

function mapWebhook(row: Record<string, unknown>): Webhook {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    url: String(row.url),
    secret: String(row.secret),
    is_active: Boolean(row.is_active),
    created_at: new Date(String(row.created_at)).toISOString(),
  };
}

function mapWebhookDelivery(row: Record<string, unknown>): WebhookDelivery {
  return {
    id: String(row.id),
    webhook_id: String(row.webhook_id),
    response_status:
      row.response_status === null || row.response_status === undefined
        ? null
        : Number(row.response_status),
    attempt_count: Number(row.attempt_count ?? 1),
    delivered_at: row.delivered_at
      ? new Date(String(row.delivered_at)).toISOString()
      : null,
    failed_at: row.failed_at
      ? new Date(String(row.failed_at)).toISOString()
      : null,
    created_at: new Date(String(row.created_at)).toISOString(),
  };
}

export function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function signPayload(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export async function getUserWebhook(userId: string): Promise<Webhook | null> {
  const result = await pool.query(
    `SELECT * FROM webhooks
     WHERE user_id = $1 AND is_active = true
     LIMIT 1`,
    [Number(userId)],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapWebhook(result.rows[0]);
}

export async function upsertWebhook(
  userId: string,
  url: string,
): Promise<Webhook> {
  const secret = generateWebhookSecret();

  const result = await pool.query(
    `INSERT INTO webhooks (user_id, url, secret)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id)
     DO UPDATE SET url = $2, is_active = true, updated_at = NOW()
     RETURNING *`,
    [Number(userId), url, secret],
  );

  return mapWebhook(result.rows[0]);
}

export async function deleteWebhook(userId: string): Promise<void> {
  await pool.query(
    `UPDATE webhooks SET is_active = false
     WHERE user_id = $1`,
    [Number(userId)],
  );
}

export async function getWebhookDeliveries(
  webhookId: string,
  limit = 10,
): Promise<WebhookDelivery[]> {
  const result = await pool.query(
    `SELECT id, webhook_id, response_status, attempt_count,
            delivered_at, failed_at, created_at
     FROM webhook_deliveries
     WHERE webhook_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [webhookId, limit],
  );

  return result.rows.map(mapWebhookDelivery);
}

export async function sendWithRetry(
  url: string,
  payload: string,
  signature: string,
  deliveryId: string,
  maxAttempts: number,
  attempt = 1,
): Promise<void> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-DocShift-Signature": signature,
        "X-DocShift-Timestamp": Date.now().toString(),
        "User-Agent": "DocShift-Webhook/1.0",
      },
      body: payload,
      signal: AbortSignal.timeout(10000),
    });

    await pool.query(
      `UPDATE webhook_deliveries
       SET response_status = $1,
           response_body = $2,
           attempt_count = $3,
           delivered_at = NOW()
       WHERE id = $4`,
      [res.status, res.statusText, attempt, deliveryId],
    );
  } catch {
    if (attempt < maxAttempts) {
      const delay = attempt * 2000;
      await new Promise((r) => setTimeout(r, delay));
      await sendWithRetry(
        url,
        payload,
        signature,
        deliveryId,
        maxAttempts,
        attempt + 1,
      );
    } else {
      await pool.query(
        `UPDATE webhook_deliveries
         SET attempt_count = $1,
             failed_at = NOW()
         WHERE id = $2`,
        [attempt, deliveryId],
      );
    }
  }
}

export async function triggerWebhook(
  userId: string,
  payload: WebhookPayload,
): Promise<void> {
  const webhook = await getUserWebhook(userId);

  if (!webhook) {
    return;
  }

  const payloadStr = JSON.stringify(payload);
  const signature = signPayload(payloadStr, webhook.secret);

  const delivery = await pool.query(
    `INSERT INTO webhook_deliveries (webhook_id, payload)
     VALUES ($1, $2)
     RETURNING id`,
    [webhook.id, payload],
  );

  const deliveryId = delivery.rows[0].id as string;

  await sendWithRetry(webhook.url, payloadStr, signature, deliveryId, 3);
}
