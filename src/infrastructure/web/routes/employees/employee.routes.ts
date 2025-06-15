import { Router, Request, Response } from 'express';
import { EmployeeController } from '../../../../application/controllers/EmployeeController';
import { authMiddleware } from '../../../../application/middlewares/authMiddleware';
import { authorize } from '../../../../application/middlewares/authorize';
import { EmployeeRole } from '../../../../core/entities/Role';

export function configureEmployeeRoutes(
    employeeController: EmployeeController,
) {
    const router = Router();

    const asyncHandler =
        (fn: any) => (req: any, res: any, next: any) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };

    //* Todas las rutas requieren autenticación...
    router.use(asyncHandler(authMiddleware));

    //* Rutas básicas...
    router.post(
        '/',
        authorize([EmployeeRole.ADMIN]),
        asyncHandler((req: Request, res: Response) =>
            employeeController.create(req, res),
        ),
    );

    router.get(
        '/',
        asyncHandler((req: Request, res: Response) =>
            employeeController.getAll(req, res),
        ),
    );

    router.get(
        '/:id',
        asyncHandler((req: Request, res: Response) =>
            employeeController.getById(req, res),
        ),
    );

    router.put(
        '/:id',
        authorize([EmployeeRole.ADMIN]),
        asyncHandler((req: Request, res: Response) =>
            employeeController.update(req, res),
        ),
    );

    router.delete(
        '/:id',
        authorize([EmployeeRole.ADMIN]),
        asyncHandler((req: Request, res: Response) =>
            employeeController.delete(req, res),
        ),
    );

    return router;
}
