import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { convert, isOutputFormat, type OutputFormat } from "@/lib/converters";
import { saveConversion } from "@/lib/db/history";
import { incrementConversionCount } from "@/lib/db/stats";
import {
  parseExcel,
  parsePdf,
  parsePpt,
  parseWord,
} from "@/lib/parsers";
import type { FileType } from "@/types";

// Pages Router used `export const config = { api: { bodyParser: false } }` for
// multipart uploads. That config does not apply in the App Router — use
// request.formData() instead. Default request body size is ~4MB unless raised
// via next.config (e.g. experimental.serverActions.bodySizeLimit).

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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const fileType = formData.get("fileType");
    const outputFormatField = formData.get("outputFormat");
    const outputFormat: OutputFormat =
      typeof outputFormatField === "string" && isOutputFormat(outputFormatField)
        ? outputFormatField
        : "json";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid file field" },
        { status: 500 },
      );
    }

    if (typeof fileType !== "string" || !isFileType(fileType)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid fileType field" },
        { status: 500 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let raw: unknown;

    switch (fileType) {
      case "excel":
        raw = parseExcel(buffer);
        break;
      case "word":
        raw = await parseWord(buffer);
        break;
      case "pdf":
        raw = await parsePdf(buffer);
        break;
      case "powerpoint":
        raw = await parsePpt(buffer);
        break;
    }

    const converted = convert(raw, outputFormat);

    const session = await auth();

    if (session?.user?.id) {
      await saveConversion({
        userId: session.user.id,
        fileName: file.name,
        fileType,
        outputFormat,
        convertedResult: converted,
      });
    }

    await incrementConversionCount();

    return NextResponse.json({
      success: true,
      fileType,
      outputFormat,
      raw,
      converted,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to parse file";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
