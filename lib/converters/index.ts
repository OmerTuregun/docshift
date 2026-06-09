import { toJson } from "./toJson";
import { toMarkdown } from "./toMarkdown";
import { toPlainText } from "./toPlainText";
import { toXml } from "./toXml";

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

export { toJson, toMarkdown, toPlainText, toXml };
