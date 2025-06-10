import { Request, Response, NextFunction } from 'express';
import { ApplicationError } from '../../core/errors';
import { EmployeeRole } from '../../core/entities/Role';

export function authorize(requiredRoles: EmployeeRole[]) {
    return (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const userRoles = (req as any).user?.roles || [];

        const hasPermission = requiredRoles.some((role) =>
            userRoles.includes(role),
        );

        if (!hasPermission) {
            throw new ApplicationError(
                'Unauthorized',
                'UNAUTHORIZED',
                403,
            );
        }

        next();
    };
}
