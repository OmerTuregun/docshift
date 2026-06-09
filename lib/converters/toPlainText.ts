import {
  extractTextLines,
  hasSlides,
  hasText,
  isSheetArray,
} from "./helpers";

function sheetsToPlainText(
  sheets: { sheetName: string; rows: Record<string, unknown>[] }[],
): string {
  return sheets
    .map((sheet) => {
      const rowLines = sheet.rows.map((row) =>
        Object.values(row)
          .map((value) => String(value ?? ""))
          .join("\t"),
      );

      return [`Sheet: ${sheet.sheetName}`, ...rowLines].join("\n");
    })
    .join("\n\n");
}

function slidesToPlainText(slides: unknown[]): string {
  return slides
    .map((slide, index) => {
      const lines = extractTextLines(slide);
      const content = lines.length > 0 ? lines.join("\n") : "No content";

      return `Slide ${index + 1}:\n${content}`;
    })
    .join("\n\n");
}

export function toPlainText(data: unknown): string {
  if (hasText(data)) {
    return data.text;
  }

  if (hasSlides(data)) {
    return slidesToPlainText(data.slides);
  }

  if (isSheetArray(data)) {
    return sheetsToPlainText(data);
  }

  return JSON.stringify(data, null, 2);
}
