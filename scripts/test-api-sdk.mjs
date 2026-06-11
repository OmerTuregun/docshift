/**
 * DocShift SDK test
 *
 * Kullanım:
 *   set DOCSHIFT_API_KEY=ds_live_...
 *   node scripts/test-api-sdk.mjs path/to/document.xlsx
 */

import { DocShift } from "../packages/docshift-sdk/dist/index.js";

const apiKey = process.env.DOCSHIFT_API_KEY;
const filePath = process.argv[2];
const baseUrl = process.env.DOCSHIFT_BASE_URL ?? "http://localhost:3030";

if (!apiKey) {
  console.error("DOCSHIFT_API_KEY ortam değişkeni gerekli.");
  process.exit(1);
}

if (!filePath) {
  console.error("Kullanım: node scripts/test-api-sdk.mjs <dosya-yolu>");
  process.exit(1);
}

const client = new DocShift({ apiKey, baseUrl });

try {
  const result = await client.convert({
    file: filePath,
    outputFormat: "json",
  });

  console.log("Başarılı!");
  console.log("fileType:", result.fileType);
  console.log("fileName:", result.fileName);
  console.log("converted (ilk 500 karakter):");
  console.log(result.converted.slice(0, 500));
} catch (error) {
  console.error("Hata:", error.message ?? error);
  if (error.code) {
    console.error("code:", error.code, "status:", error.status);
  }
  if (error.code === "INVALID_RESPONSE") {
    console.error(
      "İpucu: Sunucu hazır mı? Önce şunu deneyin:",
      "curl.exe -X POST http://localhost:3030/api/v1/convert",
    );
  }
  process.exit(1);
}
