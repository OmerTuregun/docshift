export type OutputFormat = "json" | "xml" | "markdown" | "plaintext";
export interface DocShiftConfig {
    apiKey: string;
    /** Defaults to https://yourdomain.com — set to http://localhost:3030 in dev */
    baseUrl?: string;
}
export interface ConvertResult {
    converted: string;
    fileType: string;
    outputFormat: OutputFormat;
    fileName: string;
    processedAt: string;
}
export interface ConvertFileInput {
    /** File path (Node.js) or Blob/File (browser) */
    file: string | Blob | File;
    fileName?: string;
    outputFormat: OutputFormat;
}
export interface ApiErrorBody {
    success: false;
    error: string;
    code: string;
}
export interface ApiSuccessBody {
    success: true;
    data: ConvertResult;
}
//# sourceMappingURL=types.d.ts.map