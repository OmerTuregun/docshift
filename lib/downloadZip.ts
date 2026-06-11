// browser only — do not import in server components

import JSZip from "jszip";
import type { OutputFormat } from "@/lib/converters";

export function getFileExtension(format: OutputFormat): string {
  switch (format) {
    case "json":
      return ".json";
    case "xml":
      return ".xml";
    case "markdown":
      return ".md";
    case "plaintext":
      return ".txt";
    default:
      return ".txt";
  }
}

export function sanitizeFileName(name: string): string {
  const withoutExtension = name.replace(/\.[^/.]+$/, "");
  const cleaned = withoutExtension.replace(
    /[^a-zA-Z0-9_\-üğışöçÜĞİŞÖÇ]/g,
    "_",
  );

  return cleaned.slice(0, 50);
}

export async function downloadZip(
  jobs: {
    fileName: string;
    outputFormat: OutputFormat;
    result: string;
  }[],
): Promise<void> {
  const zip = new JSZip();
  const usedNames = new Set<string>();

  for (const job of jobs) {
    const baseName = sanitizeFileName(job.fileName);
    const ext = getFileExtension(job.outputFormat);

    let finalName = `${baseName}${ext}`;
    let counter = 1;

    while (usedNames.has(finalName)) {
      finalName = `${baseName}_${counter}${ext}`;
      counter++;
    }

    usedNames.add(finalName);
    zip.file(finalName, job.result);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const link = document.createElement("a");

  link.href = url;
  link.download = `docshift_export_${date}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
