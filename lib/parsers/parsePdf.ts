import { PDFParse } from "pdf-parse";

export interface PdfParseResult {
  text: string;
  numPages: number;
}

export async function parsePdf(buffer: Buffer): Promise<PdfParseResult> {
  const parser = new PDFParse({ data: buffer });

  try {
    const textResult = await parser.getText();

    return {
      text: textResult.text,
      numPages: textResult.total,
    };
  } finally {
    await parser.destroy();
  }
}
