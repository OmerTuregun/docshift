export class DocShiftError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "DocShiftError";
    this.code = code;
    this.status = status;
  }
}
