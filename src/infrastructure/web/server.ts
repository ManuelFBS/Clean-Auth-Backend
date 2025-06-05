import express, { Request, Response } from 'express';
import cors from 'cors';
import { AuthController } from '../../application/controllers/AuthController';
import { AuthenticateUser } from '../../core/usecases/AuthenticateUser';
import { RegisterUser } from '../../core/usecases/RegisterUser';
import { UserRepository } from '../repositories/UserRepository';
import { authMiddleware } from '../../application/middlewares/authMiddleware';
import { initializeDatabase } from '../db/database';

export async function createServer() {
    const app = express();
    const connection = await initializeDatabase();
    const userRepository = new UserRepository(connection);

    const authenticateUser = new AuthenticateUser(
        userRepository,
    );
    const registerUser = new RegisterUser(userRepository);
    const authController = new AuthController(
        authenticateUser,
        registerUser,
    );

    app.use(cors());
    app.use(express.json());

    // * Función wrapper para manejar promesas...
    const asyncHandler =
        (fn: any) => (req: any, res: any, next: any) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };

    //* Rutas públicas...
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

    return app;
}
