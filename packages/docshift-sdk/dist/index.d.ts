import type { ConvertFileInput, ConvertResult, DocShiftConfig, OutputFormat } from "./types";
export { DocShiftError } from "./errors";
export type { ConvertFileInput, ConvertResult, DocShiftConfig, OutputFormat, } from "./types";
export declare class DocShift {
    private readonly apiKey;
    private readonly baseUrl;
    constructor(config: DocShiftConfig);
    convert(input: ConvertFileInput): Promise<ConvertResult>;
    convertFile(file: ConvertFileInput["file"], outputFormat: OutputFormat, fileName?: string): Promise<ConvertResult>;
}
export declare function createDocShiftClient(config: DocShiftConfig): DocShift;
//# sourceMappingURL=index.d.ts.map