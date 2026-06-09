import {
  extractTextLines,
  hasSlides,
  hasText,
  isSheetArray,
} from "./helpers";

function textToMarkdown(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => paragraph.replace(/\n/g, " "))
    .join("\n\n");
}

function sheetsToMarkdown(
  sheets: { sheetName: string; rows: Record<string, unknown>[] }[],
): string {
  return sheets
    .map((sheet) => {
      const { sheetName, rows } = sheet;

      if (rows.length === 0) {
        return `### ${sheetName}\n\n_No data_`;
      }

      const columns = [
        ...new Set(rows.flatMap((row) => Object.keys(row))),
      ];
      const header = `| ${columns.join(" | ")} |`;
      const separator = `| ${columns.map(() => "---").join(" | ")} |`;
      const body = rows
        .map(
          (row) =>
            `| ${columns.map((column) => String(row[column] ?? "")).join(" | ")} |`,
        )
        .join("\n");

      return `### ${sheetName}\n\n${header}\n${separator}\n${body}`;
    })
    .join("\n\n");
}

function slidesToMarkdown(slides: unknown[]): string {
  return slides
    .map((slide, index) => {
      const lines = extractTextLines(slide);
      const bullets =
        lines.length > 0
          ? lines.map((line) => `- ${line}`).join("\n")
          : "- _No content_";

      return `## Slide ${index + 1}\n\n${bullets}`;
    })
    .join("\n\n");
}

export function toMarkdown(data: unknown): string {
  if (hasText(data)) {
    return textToMarkdown(data.text);
  }

  if (hasSlides(data)) {
    return slidesToMarkdown(data.slides);
  }

  if (isSheetArray(data)) {
    return sheetsToMarkdown(data);
  }

  return textToMarkdown(JSON.stringify(data, null, 2));
}
