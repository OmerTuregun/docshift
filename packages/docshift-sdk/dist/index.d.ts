import type { ConvertFileInput, ConvertResult, DocShiftConfig, OutputFormat } from "./types.js";
export { DocShiftError } from "./errors.js";
export type { ConvertFileInput, ConvertResult, DocShiftConfig, OutputFormat, } from "./types.js";
export declare class DocShift {
    private readonly apiKey;
    private readonly baseUrl;
    constructor(config: DocShiftConfig);
    convert(input: ConvertFileInput): Promise<ConvertResult>;
    convertFile(file: ConvertFileInput["file"], outputFormat: OutputFormat, fileName?: string): Promise<ConvertResult>;
}
export declare function createDocShiftClient(config: DocShiftConfig): DocShift;
//# sourceMappingURL=index.d.ts.map