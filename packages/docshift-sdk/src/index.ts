import { DocShiftError } from "./errors";
import type {
  ApiErrorBody,
  ApiSuccessBody,
  ConvertFileInput,
  ConvertResult,
  DocShiftConfig,
  OutputFormat,
} from "./types";

export { DocShiftError } from "./errors";
export type {
  ConvertFileInput,
  ConvertResult,
  DocShiftConfig,
  OutputFormat,
} from "./types";

async function toUploadFile(
  input: ConvertFileInput["file"],
  fileName?: string,
): Promise<File> {
  if (typeof input === "string") {
    const { readFile } = await import("node:fs/promises");
    const { basename } = await import("node:path");
    const buffer = await readFile(input);
    const name = fileName ?? basename(input);

    return new File([buffer], name);
  }

  if (input instanceof File) {
    return input;
  }

  return new File([input], fileName ?? "document");
}

export class DocShift {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: DocShiftConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl ?? "https://yourdomain.com").replace(/\/$/, "");
  }

  async convert(input: ConvertFileInput): Promise<ConvertResult> {
    return this.convertFile(
      input.file,
      input.outputFormat,
      input.fileName,
    );
  }

  async convertFile(
    file: ConvertFileInput["file"],
    outputFormat: OutputFormat,
    fileName?: string,
  ): Promise<ConvertResult> {
    const uploadFile = await toUploadFile(file, fileName);
    const formData = new FormData();

    formData.append("file", uploadFile);
    formData.append("outputFormat", outputFormat);

    const response = await fetch(`${this.baseUrl}/api/v1/convert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    const body = (await response.json()) as ApiSuccessBody | ApiErrorBody;

    if (!response.ok || !body.success) {
      const errorBody = body as ApiErrorBody;

      throw new DocShiftError(
        errorBody.error ?? "Dönüşüm başarısız",
        errorBody.code ?? "UNKNOWN",
        response.status,
      );
    }

    return body.data;
  }
}

export function createDocShiftClient(config: DocShiftConfig): DocShift {
  return new DocShift(config);
}
