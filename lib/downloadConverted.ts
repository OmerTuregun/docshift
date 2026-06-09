import type { OutputFormat } from "@/lib/converters";

const EXTENSION_BY_FORMAT: Record<OutputFormat, string> = {
  json: "json",
  xml: "xml",
  markdown: "md",
  plaintext: "txt",
};

export function downloadConvertedFile(
  fileName: string,
  outputFormat: string,
  convertedResult: string,
) {
  const extension =
    EXTENSION_BY_FORMAT[outputFormat as OutputFormat] ?? "txt";
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const blob = new Blob([convertedResult], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${baseName}.${extension}`;
  link.click();
  URL.revokeObjectURL(url);
}
