import { promises as fs } from "fs";
import PPTX2Json from "pptx2json";

const TMP_FILE_PATH = "/tmp/upload.pptx";

export interface PptParseResult {
  slides: unknown[];
}

export async function parsePpt(buffer: Buffer): Promise<PptParseResult> {
  await fs.writeFile(TMP_FILE_PATH, buffer);

  try {
    const pptx = new PPTX2Json();
    const json = await pptx.toJson(TMP_FILE_PATH);

    const slides = Object.keys(json)
      .filter((key) => /^ppt\/slides\/slide\d+\.xml$/.test(key))
      .sort((a, b) => {
        const slideNumber = (path: string) =>
          Number(path.match(/slide(\d+)\.xml$/)?.[1] ?? 0);

        return slideNumber(a) - slideNumber(b);
      })
      .map((key) => json[key]);

    return { slides };
  } finally {
    await fs.unlink(TMP_FILE_PATH).catch(() => undefined);
  }
}
