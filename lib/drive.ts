import pool from "@/lib/db/pool";

export async function getGoogleAccessToken(
  userId: string,
): Promise<string | null> {
  const result = await pool.query(
    `SELECT access_token FROM accounts
     WHERE "userId" = $1
     AND provider = 'google'
     LIMIT 1`,
    [Number(userId)],
  );

  const token = result.rows[0]?.access_token;

  return typeof token === "string" && token.length > 0 ? token : null;
}

const GOOGLE_EXPORT_MIME: Record<string, string> = {
  "application/vnd.google-apps.spreadsheet":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.google-apps.document":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.google-apps.presentation":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export async function downloadDriveFile(
  fileId: string,
  accessToken: string,
): Promise<{ buffer: Buffer; mimeType: string; fileName: string }> {
  const metaRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType,name`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!metaRes.ok) {
    throw new DriveApiError("Dosya bilgisi alınamadı", metaRes.status);
  }

  const meta = (await metaRes.json()) as { mimeType?: string; name?: string };
  const driveMimeType = meta.mimeType ?? "application/octet-stream";
  const exportMimeType = GOOGLE_EXPORT_MIME[driveMimeType];

  const fileRes = exportMimeType
    ? await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${encodeURIComponent(exportMimeType)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
    : await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

  if (!fileRes.ok) {
    throw new DriveApiError("Dosya indirilemedi", fileRes.status);
  }

  const buffer = Buffer.from(await fileRes.arrayBuffer());
  const mimeType =
    fileRes.headers.get("content-type") ??
    exportMimeType ??
    driveMimeType;

  return {
    buffer,
    mimeType,
    fileName: meta.name ?? "drive-file",
  };
}

export class DriveApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "DriveApiError";
  }
}
