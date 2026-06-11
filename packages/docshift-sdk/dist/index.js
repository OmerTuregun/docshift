import { DocShiftError } from "./errors.js";
export { DocShiftError } from "./errors.js";
async function toUploadFile(input, fileName) {
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
    apiKey;
    baseUrl;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = (config.baseUrl ?? "https://yourdomain.com").replace(/\/$/, "");
    }
    async convert(input) {
        return this.convertFile(input.file, input.outputFormat, input.fileName);
    }
    async convertFile(file, outputFormat, fileName) {
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
        const responseText = await response.text();
        let body;
        try {
            body = JSON.parse(responseText);
        }
        catch {
            throw new DocShiftError(responseText.trim() || "API geçersiz yanıt döndürdü", "INVALID_RESPONSE", response.status);
        }
        if (!response.ok || !body.success) {
            const errorBody = body;
            throw new DocShiftError(errorBody.error ?? "Dönüşüm başarısız", errorBody.code ?? "UNKNOWN", response.status);
        }
        return body.data;
    }
}
export function createDocShiftClient(config) {
    return new DocShift(config);
}
