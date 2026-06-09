export function hasText(
  input: unknown,
): input is { text: string; numPages?: number } {
  return (
    typeof input === "object" &&
    input !== null &&
    "text" in input &&
    typeof (input as { text: unknown }).text === "string"
  );
}

export function hasSlides(input: unknown): input is { slides: unknown[] } {
  return (
    typeof input === "object" &&
    input !== null &&
    "slides" in input &&
    Array.isArray((input as { slides: unknown }).slides)
  );
}

export function isSheetArray(
  input: unknown,
): input is { sheetName: string; rows: Record<string, unknown>[] }[] {
  return (
    Array.isArray(input) &&
    input.every(
      (sheet) =>
        typeof sheet === "object" &&
        sheet !== null &&
        "sheetName" in sheet &&
        "rows" in sheet &&
        Array.isArray((sheet as { rows: unknown }).rows),
    )
  );
}

export function extractTextLines(value: unknown): string[] {
  const lines: string[] = [];

  const walk = (node: unknown) => {
    if (node === null || node === undefined) return;

    if (typeof node === "string") {
      const trimmed = node.trim();
      if (trimmed) lines.push(trimmed);
      return;
    }

    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }

    if (typeof node === "object") {
      Object.values(node).forEach(walk);
    }
  };

  walk(value);
  return lines;
}
