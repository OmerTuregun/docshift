export class DocShiftError extends Error {
    code;
    status;
    constructor(message, code, status) {
        super(message);
        this.name = "DocShiftError";
        this.code = code;
        this.status = status;
    }
}
