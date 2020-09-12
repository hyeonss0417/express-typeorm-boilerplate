export class CustomError extends Error {
  code: string;
  status: number;

  constructor(code = "GENERIC", status = 500, ...params) {
    super(...params);
    this.name = "CustomError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
    this.code = code;
    this.status = status;
  }
}
