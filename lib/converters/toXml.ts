function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sanitizeTag(name: string): string {
  const sanitized = name.replace(/[^a-zA-Z0-9_-]/g, "_");
  return /^[0-9]/.test(sanitized) ? `_${sanitized}` : sanitized;
}

function arrayToXml(items: unknown[]): string {
  return items.map((item) => `<item>${valueToXmlContent(item)}</item>`).join("");
}

function valueToXmlContent(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return arrayToXml(value);
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, nestedValue]) => {
        const tag = sanitizeTag(key);

        if (Array.isArray(nestedValue)) {
          return `<${tag}>${arrayToXml(nestedValue)}</${tag}>`;
        }

        if (nestedValue !== null && typeof nestedValue === "object") {
          return `<${tag}>${valueToXmlContent(nestedValue)}</${tag}>`;
        }

        return `<${tag}>${escapeXml(String(nestedValue ?? ""))}</${tag}>`;
      })
      .join("");
  }

  return escapeXml(String(value));
}

export function toXml(data: unknown): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<docshift>${valueToXmlContent(data)}</docshift>`;
}
