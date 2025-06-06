import { Request, Response, NextFunction } from 'express';
import { ApplicationError } from '../../core/errors';

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (err instanceof ApplicationError) {
        return res.status(err.statusCode).json({
            error: {
                message: err.message,
                code: err.code,
                status: err.statusCode,
            },
        });
    }

    console.error('Unhandled error:', err);

    res.status(500).json({
        error: {
            message: 'Internal Server Error',
            code: 'INTERNAL_ERROR',
            status: 500,
        },
    });
}
