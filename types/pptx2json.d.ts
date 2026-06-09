declare module "pptx2json" {
  export default class PPTX2Json {
    constructor(options?: Record<string, string>);
    toJson(filePath: string): Promise<Record<string, unknown>>;
    buffer2json(buffer: Buffer): Promise<Record<string, unknown>>;
  }
}
