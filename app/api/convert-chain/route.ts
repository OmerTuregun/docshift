import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  convertFromString,
  isOutputFormat,
  type OutputFormat,
} from "@/lib/converters";
import { saveConversion } from "@/lib/db/history";
import { incrementConversionCount } from "@/lib/db/stats";
import type { FileType } from "@/types";

export const runtime = "nodejs";

const VALID_FILE_TYPES: FileType[] = [
  "excel",
  "word",
  "pdf",
  "powerpoint",
];

function isFileType(value: string): value is FileType {
  return VALID_FILE_TYPES.includes(value as FileType);
}

interface ConvertChainBody {
  content?: string;
  fromFormat?: string;
  toFormat?: string;
  fileName?: string;
  fileType?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ConvertChainBody;
    const {
      content,
      fromFormat: fromFormatField,
      toFormat: toFormatField,
      fileName,
      fileType,
    } = body;

    if (
      typeof content !== "string" ||
      typeof fileName !== "string" ||
      typeof fileType !== "string" ||
      !isFileType(fileType) ||
      typeof fromFormatField !== "string" ||
      !isOutputFormat(fromFormatField) ||
      typeof toFormatField !== "string" ||
      !isOutputFormat(toFormatField)
    ) {
      return NextResponse.json(
        { success: false, error: "Eksik veya geçersiz alanlar" },
        { status: 400 },
      );
    }

    const fromFormat = fromFormatField as OutputFormat;
    const toFormat = toFormatField as OutputFormat;

    if (fromFormat === toFormat) {
      return NextResponse.json(
        { success: false, error: "Kaynak ve hedef format aynı olamaz" },
        { status: 400 },
      );
    }

    const converted = convertFromString(content, fromFormat, toFormat);
    const session = await auth();

    if (session?.user?.id) {
      await saveConversion({
        userId: session.user.id,
        fileName: `${fileName} (${fromFormat}→${toFormat})`,
        fileType,
        outputFormat: toFormat,
        convertedResult: converted,
      });
    }

    await incrementConversionCount();

    return NextResponse.json({
      success: true,
      converted,
      fromFormat,
      toFormat,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Dönüşüm yapılamadı";

    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}
