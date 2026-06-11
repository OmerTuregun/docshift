import { NextResponse } from "next/server";
import { FILE_SIZE_ERROR, FILE_SIZE_LIMIT_BYTES } from "@/lib/constants";
import { convert, isOutputFormat, type OutputFormat } from "@/lib/converters";
import {
  getApiKeyUsageCountLastHour,
  logApiKeyUsage,
  validateApiKey,
} from "@/lib/db/apiKeys";
import { saveConversion } from "@/lib/db/history";
import { incrementConversionCount } from "@/lib/db/stats";
import { detectFileType } from "@/lib/detectFileType";
import { parseUploadedFile } from "@/lib/parseUploadedFile";

export const runtime = "nodejs";

const RATE_LIMIT_PER_HOUR = 100;

function errorResponse(
  error: string,
  code: string,
  status: number,
) {
  return NextResponse.json({ success: false, error, code }, { status });
}

export async function POST(request: Request) {
  // Rate limiting handled via API key (see lib/db/apiKeys.ts)

  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return errorResponse(
      "Authorization header gerekli",
      "MISSING_AUTH",
      401,
    );
  }

  const rawKey = authHeader.replace("Bearer ", "").trim();
  const { valid, keyId, userId } = await validateApiKey(rawKey);

  if (!valid || !keyId || !userId) {
    return errorResponse("Geçersiz API key", "INVALID_KEY", 401);
  }

  const usageCount = await getApiKeyUsageCountLastHour(keyId);

  if (usageCount >= RATE_LIMIT_PER_HOUR) {
    await logApiKeyUsage(keyId, "/api/v1/convert", "", "", 429);
    return errorResponse(
      "Rate limit aşıldı. Saatte 100 istek.",
      "RATE_LIMITED",
      429,
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const outputFormatField = formData.get("outputFormat");

    if (!(file instanceof File)) {
      return errorResponse("Dosya gerekli", "MISSING_FILE", 400);
    }

    if (
      typeof outputFormatField !== "string" ||
      !isOutputFormat(outputFormatField)
    ) {
      return errorResponse("Geçersiz outputFormat", "INVALID_FORMAT", 400);
    }

    const outputFormat = outputFormatField as OutputFormat;

    if (file.size > FILE_SIZE_LIMIT_BYTES) {
      await logApiKeyUsage(
        keyId,
        "/api/v1/convert",
        "",
        outputFormat,
        413,
      );
      return errorResponse(FILE_SIZE_ERROR, "FILE_TOO_LARGE", 413);
    }

    const fileType = detectFileType(file.name);

    if (!fileType) {
      await logApiKeyUsage(
        keyId,
        "/api/v1/convert",
        "",
        outputFormat,
        415,
      );
      return errorResponse(
        "Desteklenmeyen dosya türü",
        "UNSUPPORTED_FILE",
        415,
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await parseUploadedFile(fileType, buffer);
    const converted = convert(parsed, outputFormat);

    await logApiKeyUsage(
      keyId,
      "/api/v1/convert",
      fileType,
      outputFormat,
      200,
    );

    await saveConversion({
      userId,
      fileName: file.name,
      fileType,
      outputFormat,
      convertedResult: converted,
    });

    await incrementConversionCount();

    return NextResponse.json({
      success: true,
      data: {
        converted,
        fileType,
        outputFormat,
        fileName: file.name,
        processedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Dönüşüm yapılamadı";

    await logApiKeyUsage(keyId, "/api/v1/convert", "", "", 500);

    return errorResponse(message, "CONVERSION_FAILED", 500);
  }
}
