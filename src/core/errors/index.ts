export class ApplicationError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number,
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ValidationError extends ApplicationError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR', 400);
    }
}

export class AuthenticationError extends ApplicationError {
    constructor(message: string) {
        super(message, 'AUTHENTICATION_ERROR', 401);
    }
}

export class DatabaseError extends ApplicationError {
    constructor(message: string) {
        super(message, 'DATABASE_ERROR', 500);
    }
}

export class NotFoundError extends ApplicationError {
    constructor(message: string) {
        super(message, 'NOT_FOUND_ERROR', 404);
    }
}
