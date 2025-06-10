import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { authMiddleware } from '../../application/middlewares/authMiddleware';
import { errorHandler } from '../../application/middlewares/errorHandler';
import { container, setupContainer } from '../container';
import { AuthController } from '../../application/controllers/AuthController';
import { EmployeeRole } from '../../core/entities/Role';
import { authorize } from '../../application/middlewares/authorize';

export async function createServer() {
    await setupContainer();

    const app = express();

    const authController =
        container.get<AuthController>(AuthController);

    app.use(cors());
    app.use(express.json());

    // * Función wrapper para manejar promesas...
    const asyncHandler =
        (fn: any) => (req: any, res: any, next: any) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };

    //* Rutas protegidas...
    app.get(
        '/admin',
        asyncHandler(authMiddleware),
        authorize([EmployeeRole.ADMIN]),
    );

    //* Rutas públicas...
    app.post(
        '/register',
        asyncHandler((req: Request, res: Response) =>
            authController.register(req, res),
        ),
    );

    app.post(
        '/login',
        asyncHandler((req: Request, res: Response) =>
            authController.login(req, res),
        ),
    );

    //* Ruta protegida (ejemplo)...
    app.get(
        '/profile',
        asyncHandler(authMiddleware),
        asyncHandler((req: Request, res: Response) => {
            return res.json({
                userId: (req as any).userId,
            });
        }),
    );

    app.use(asyncHandler(errorHandler));

    return app;
}
