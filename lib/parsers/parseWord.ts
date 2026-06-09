import mammoth from "mammoth";

export interface WordParseResult {
  text: string;
}

export async function parseWord(buffer: Buffer): Promise<WordParseResult> {
  const result = await mammoth.extractRawText({ buffer });

  return { text: result.value };
}
