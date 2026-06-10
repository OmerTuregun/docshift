import { toJson } from "./toJson";
import { toMarkdown } from "./toMarkdown";
import { toPlainText } from "./toPlainText";
import { toXml } from "./toXml";
import { xmlToObject } from "./xmlToObject";

export type OutputFormat = "json" | "xml" | "markdown" | "plaintext";

const VALID_OUTPUT_FORMATS: OutputFormat[] = [
  "json",
  "xml",
  "markdown",
  "plaintext",
];

export function isOutputFormat(value: string): value is OutputFormat {
  return VALID_OUTPUT_FORMATS.includes(value as OutputFormat);
}

export function convert(data: unknown, format: OutputFormat): string {
  switch (format) {
    case "json":
      return toJson(data);
    case "xml":
      return toXml(data);
    case "markdown":
      return toMarkdown(data);
    case "plaintext":
      return toPlainText(data);
  }
}

export function convertFromString(
  content: string,
  fromFormat: OutputFormat,
  toFormat: OutputFormat,
): string {
  if (fromFormat === toFormat) {
    throw new Error("Kaynak ve hedef format aynı olamaz");
  }

  let data: unknown;

  switch (fromFormat) {
    case "json": {
      try {
        data = JSON.parse(content);
      } catch {
        throw new Error("Geçersiz JSON — dönüşüm yapılamadı");
      }
      break;
    }
    case "xml":
      data = xmlToObject(content);
      break;
    case "markdown":
      data = content;
      break;
    case "plaintext":
      data = { text: content };
      break;
  }

  return convert(data, toFormat);
}

export { toJson, toMarkdown, toPlainText, toXml, xmlToObject };
