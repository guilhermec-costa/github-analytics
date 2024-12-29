export abstract class BaseException extends Error {
    readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class BadRequest extends BaseException {
    constructor(message: string) {
        super(message, 400);
    }
}

export class InternalServerError extends BaseException {
    constructor(message: string) {
        super(message, 500)
    };
}

export class Unauthorized extends BaseException {
    constructor(message: string) {
        super(message, 401);
    }
}

export class NotFound extends BaseException {
    constructor(message: string) {
        super(message, 404);
    }
}