import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../entities/User';

export class AuthenticateUser {
    constructor(private userRepository: IUserRepository) {}

    async execute(
        username: string,
        password: string,
    ): Promise<{ user: User; token: string }> {
        const user =
            await this.userRepository.findByUsername(
                username,
            );

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'default-secret',
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            } as SignOptions,
        );

        return { user, token };
    }
}
