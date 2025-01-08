import { HttpStatus } from "./HttpStatus";

export abstract class BaseException extends Error {
  readonly statusCode: number;
  public readonly postParseAsJson: boolean;

  constructor(
    message: string,
    statusCode: number,
    postParseAsJson: boolean = false,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.postParseAsJson = postParseAsJson;
  }
}

export class BadRequest extends BaseException {
  constructor(message: string, postParseAsJson: boolean = false) {
    super(message, HttpStatus.BAD_REQUEST, postParseAsJson);
  }
}

export class InternalServerError extends BaseException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class Unauthorized extends BaseException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class NotFound extends BaseException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
