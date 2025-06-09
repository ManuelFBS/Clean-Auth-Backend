import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { AuthenticateUser } from '../../core/usecases/AuthenticateUser';
import { RegisterUser } from '../../core/usecases/RegisterUser';
import { LoginDTO, RegisterDTO } from '../dtos/AuthDTO';

@injectable()
export class AuthController {
    constructor(
        @inject(AuthenticateUser)
        private authenticateUser: AuthenticateUser,
        @inject(RegisterUser)
        private registerUser: RegisterUser,
    ) {}

    async login(req: Request, res: Response) {
        try {
            const { username, password }: LoginDTO =
                req.body;

            if (!username || !password) {
                return res.status(400).json({
                    message:
                        'Username and password are required...!',
                });
            }

            const { user, token } =
                await this.authenticateUser.execute(
                    username,
                    password,
                );

            res.status(200).json({
                user: user.toJSON(),
                token,
            });
        } catch (error: any) {
            res.status(401).json({
                error: error.message,
            });
        }
    }

    async register(req: Request, res: Response) {
        try {
            const { username, password }: RegisterDTO =
                req.body;

            if (!username || !password) {
                return res.status(400).json({
                    error: 'Username and password are required',
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password must be at least 6 characters...!',
                });
            }

            const user = await this.registerUser.execute(
                username,
                password,
            );

            return res.status(201).json(user.toJSON());
        } catch (error: any) {
            return res
                .status(400)
                .json({ error: error.message });
        }
    }
}
