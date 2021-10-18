import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Not found");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializedErrors() {
    return [{ message: "Not Found" }];
  }
}
