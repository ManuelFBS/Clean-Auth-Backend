import { ValidationError } from '../errors';

export class UserValidator {
    static validateUsername(username: string): void {
        if (!username)
            throw new ValidationError(
                'Username is required',
            );

        if (username.length < 3)
            throw new Error(
                'Username must be at least 3 characters',
            );

        if (username.length > 30)
            throw new Error(
                'Username must be less than 30 characters',
            );

        if (!/[a-zA-Z0-9_]+$/.test(username))
            throw new Error(
                'Username can only contain letters, numbers and underscores',
            );
    }

    static validatePassword(password: string): void {
        if (!password)
            throw new Error('Password is required');

        if (password.length < 8)
            throw new Error(
                'Password must be at least 8 characters',
            );

        if (password.length > 15)
            throw new Error(
                'The password must be a maximum of 15 characters.',
            );

        if (!/[A-Z]/.test(password))
            throw new Error(
                'Password must contain at least one uppercase letter',
            );

        if (!/[a-z]/.test(password))
            throw new Error(
                'Password must contain at least one lowercase letter',
            );

        if (!/[0-9]/.test(password))
            throw new Error(
                'Password must contain at least one number',
            );
    }
}
