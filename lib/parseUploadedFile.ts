import {
  parseExcel,
  parsePdf,
  parsePpt,
  parseWord,
} from "@/lib/parsers";
import type { FileType } from "@/types";

export async function parseUploadedFile(
  fileType: FileType,
  buffer: Buffer,
): Promise<unknown> {
  switch (fileType) {
    case "excel":
      return parseExcel(buffer);
    case "word":
      return await parseWord(buffer);
    case "pdf":
      return await parsePdf(buffer);
    case "powerpoint":
      return await parsePpt(buffer);
  }
}
