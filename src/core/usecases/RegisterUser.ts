import bcrypt from 'bcrypt';
import { injectable, inject } from 'inversify';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../entities/User';
import { UserValidator } from '../validators/UserValidator';

@injectable()
export class RegisterUser {
    constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}

    async execute(
        username: string,
        password: string,
    ): Promise<User> {
        //* Validaciones...
        UserValidator.validateUsername(username);
        UserValidator.validatePassword(password);

        const existingUser =
            await this.userRepository.findByUsername(
                username,
            );

        if (existingUser) {
            throw new Error('Username already exists...!');
        }

        //* Crear el nuevo usuario...
        const hashedPassword = await bcrypt.hash(
            password,
            10,
        );
        const newUser = new User(
            0,
            username,
            hashedPassword,
            new Date(),
            new Date(),
        );

        //* Guardar en la base de datos...
        return await this.userRepository.save(newUser);
    }
}
