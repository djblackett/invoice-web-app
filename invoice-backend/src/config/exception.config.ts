/*
This file was adapted from the following repository:
https://github.com/vishnucprasad/express_ts/blob/main/src/config/exception.config.ts
It basically made TS behave with the error types.
*/

export class BaseException extends Error {
  public statusCode: number;

  constructor(type: string, statusCode: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = type;
    this.statusCode = statusCode;
  }
}

export class InternalServerException extends BaseException {
  constructor(message: string) {
    super("InternalServerException", 500, message);
  }
}

export class NotFoundException extends BaseException {
  constructor(message: string) {
    super("NotFoundException", 404, message);
  }
}

export class BadRequestException extends BaseException {
  constructor(message: string) {
    super("BadRequestException", 400, message);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message: string) {
    super("UnauthorizedException", 401, message);
  }
}

export class ForbiddenException extends BaseException {
  constructor(message: string) {
    super("ForbiddenException", 403, message);
  }
}

export class ValidationException extends BaseException {
  constructor(message: string) {
    super("ValidationException", 400, message);
  }
}
